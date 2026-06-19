import * as SecureStore from 'expo-secure-store';

import type { AuthSession } from '@/features/auth/types';

const authSessionKey = 'tasktracker.auth.session';

export async function getStoredAuthSession(): Promise<AuthSession | null> {
  if (!(await SecureStore.isAvailableAsync())) {
    return null;
  }

  const rawSession = await SecureStore.getItemAsync(authSessionKey);

  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession) as Partial<AuthSession>;

    if (
      typeof session.accessToken !== 'string' ||
      typeof session.refreshToken !== 'string' ||
      typeof session.expiresAt !== 'string' ||
      !session.user ||
      typeof session.user.id !== 'string' ||
      typeof session.user.email !== 'string' ||
      typeof session.user.name !== 'string'
    ) {
      await clearStoredAuthSession();
      return null;
    }

    return session as AuthSession;
  } catch {
    await clearStoredAuthSession();
    return null;
  }
}

export async function setStoredAuthSession(session: AuthSession): Promise<void> {
  if (!(await SecureStore.isAvailableAsync())) {
    throw new Error('SecureStore is not available on this platform.');
  }

  await SecureStore.setItemAsync(authSessionKey, JSON.stringify(session));
}

export async function clearStoredAuthSession(): Promise<void> {
  if (!(await SecureStore.isAvailableAsync())) {
    return;
  }

  await SecureStore.deleteItemAsync(authSessionKey);
}
