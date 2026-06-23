import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import React from 'react';
import { signOut as signOutFirebase } from 'firebase/auth';

import {
  clearStoredAuthSession,
  getStoredAuthSession,
  setStoredAuthSession,
} from '@/lib/storage/auth-session-storage';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase/firebase';
import type { AuthSession, AuthStatus } from '@/features/auth/types';

type AuthContextValue = {
  session: AuthSession | null;
  status: AuthStatus;
  signInWithSession: (session: AuthSession) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithLocalPreview: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const storedSession = await getStoredAuthSession();

      if (cancelled) {
        return;
      }

      setSession(storedSession);
      setStatus(storedSession ? 'authenticated' : 'unauthenticated');
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const signInWithSession = useCallback(async (nextSession: AuthSession) => {
    await setStoredAuthSession(nextSession);
    setSession(nextSession);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(async () => {
    if (isFirebaseConfigured()) {
      await signOutFirebase(getFirebaseAuth()).catch(() => undefined);
    }
    await clearStoredAuthSession();
    setSession(null);
    setStatus('unauthenticated');
  }, []);

  const signInWithLocalPreview = useCallback(async () => {
    await signInWithSession({
      accessToken: 'local-preview-access-token',
      refreshToken: 'local-preview-refresh-token',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      user: {
        id: 'local-preview-user',
        email: 'jiaming@example.com',
        name: 'Jiaming',
      },
    });
  }, [signInWithSession]);

  const value = useMemo(
    () => ({
      session,
      signInWithLocalPreview,
      signInWithSession,
      signOut,
      status,
    }),
    [session, signInWithLocalPreview, signInWithSession, signOut, status]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const value = React.use(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return value;
}
