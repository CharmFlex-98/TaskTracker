import { firebaseAuth } from '@/lib/firebase/firebase';
import { getStoredAuthSession } from '@/lib/storage/auth-session-storage';
import { ApiError } from './api-error';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  auth?: boolean;
  body?: unknown;
  errorCode?: string;
  fallbackErrorMessage?: (status: number) => string;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  if (!apiUrl) {
    throw new ApiError('EXPO_PUBLIC_API_URL is not configured.', 0, 'API_URL_MISSING');
  }

  const { auth = false, body, errorCode = 'API_REQUEST_FAILED', fallbackErrorMessage, headers, ...requestInit } = options;
  const token = auth ? await getAccessToken() : null;
  const response = await fetch(`${apiUrl}${path}`, {
    ...requestInit,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const responseBody = await response.json().catch(() => undefined);

  if (!response.ok) {
    const message =
      typeof responseBody?.errorMessage === 'string'
        ? responseBody.errorMessage
        : fallbackErrorMessage?.(response.status) ?? `Request failed with HTTP ${response.status}.`;
    throw new ApiError(message, response.status, errorCode);
  }

  return responseBody as T;
}

export function authenticatedApiRequest<T>(
  path: string,
  options: Omit<ApiRequestOptions, 'auth'> = {}
): Promise<T> {
  return apiRequest<T>(path, {
    ...options,
    auth: true,
  });
}

async function getAccessToken() {
  const currentUser = firebaseAuth.currentUser;

  if (currentUser) {
    return currentUser.getIdToken();
  }

  const storedSession = await getStoredAuthSession();
  return storedSession?.accessToken ?? null;
}
