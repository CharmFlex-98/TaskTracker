import { apiRequest } from '@/lib/api/api-client';
import { ApiError } from '@/lib/api/api-error';
import type { AuthSession, FirebaseAuthRequest } from '@/features/auth/types';

type AuthSessionResponse = {
  accessToken?: unknown;
  refreshToken?: unknown;
  expiresAt?: unknown;
  user?: {
    id?: unknown;
    email?: unknown;
    name?: unknown;
    avatarUrl?: unknown;
  };
};

export async function exchangeGoogleCodeForSession(
  request: FirebaseAuthRequest
): Promise<AuthSession> {
  return exchangeFirebaseTokenForSession(request);
}

export async function exchangeFirebaseTokenForSession(request: FirebaseAuthRequest): Promise<AuthSession> {
  const body = await apiRequest<AuthSessionResponse>('/auth/firebase', {
    body: request,
    errorCode: 'FIREBASE_AUTH_EXCHANGE_FAILED',
    fallbackErrorMessage: (status) => `Auth failed with HTTP ${status}.`,
    method: 'POST',
  });
  return parseAuthSession(body);
}

function parseAuthSession(body: AuthSessionResponse): AuthSession {
  if (
    typeof body.accessToken !== 'string' ||
    typeof body.refreshToken !== 'string' ||
    !body.user ||
    typeof body.user.id !== 'string' ||
    typeof body.user.email !== 'string' ||
    typeof body.user.name !== 'string'
  ) {
    throw new ApiError('Auth response is missing required session fields.', 0, 'INVALID_AUTH_RESPONSE');
  }

  return {
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
    expiresAt: typeof body.expiresAt === 'string' ? body.expiresAt : '',
    user: {
      id: body.user.id,
      email: body.user.email,
      name: body.user.name,
      avatarUrl: typeof body.user.avatarUrl === 'string' ? body.user.avatarUrl : undefined,
    },
  };
}
