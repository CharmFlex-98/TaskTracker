export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
};

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type GoogleAuthExchangeRequest = {
  code: string;
  redirectUri: string;
  codeVerifier?: string;
};

export type FirebaseAuthRequest = {
  idToken: string;
};
