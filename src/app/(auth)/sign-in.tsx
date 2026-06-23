import * as Google from 'expo-auth-session/providers/google';
import { Redirect, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { FeedbackState } from '@/components/feedback-state';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/auth-provider';
import { exchangeFirebaseTokenForSession } from '@/features/auth/auth-api';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase/firebase';

WebBrowser.maybeCompleteAuthSession();

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const googleAndroidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

export default function SignInScreen() {
  const router = useRouter();
  const { signInWithLocalPreview, signInWithSession, status } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const handledResponseUrlRef = useRef<string | null>(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      androidClientId: googleAndroidClientId,
      iosClientId: googleIosClientId,
      scopes: ['openid', 'profile', 'email'],
      webClientId: googleWebClientId,
    }
  );
  const isGoogleConfigured = Boolean(apiUrl && googleWebClientId && isFirebaseConfigured());

  if (__DEV__ && request) {
    console.info('[auth] Google redirect URI:', request.redirectUri);
    console.info('[auth] Google client ID:', request.clientId);
  }

  const completeGoogleSignIn = useCallback(async (googleIdToken: unknown) => {
    if (typeof googleIdToken !== 'string' || googleIdToken.length === 0) {
      setErrorMessage('Google sign-in did not return an ID token.');
      setIsSigningIn(false);
      return;
    }

    try {
      const credential = GoogleAuthProvider.credential(googleIdToken);
      const firebaseCredential = await signInWithCredential(getFirebaseAuth(), credential);
      const firebaseIdToken = await firebaseCredential.user.getIdToken();

      const session = await exchangeFirebaseTokenForSession({
        idToken: firebaseIdToken,
      });

      await signInWithSession(session);
      router.replace('/');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Google sign-in failed.');
    } finally {
      setIsSigningIn(false);
    }
  }, [router, signInWithSession]);

  useEffect(() => {
    if (response?.type !== 'success') {
      return;
    }

    const responseUrl = response.url ?? response.params.code ?? response.params.id_token ?? '';

    if (handledResponseUrlRef.current === responseUrl) {
      return;
    }

    handledResponseUrlRef.current = responseUrl;
    void completeGoogleSignIn(response.params.id_token);
  }, [completeGoogleSignIn, response]);

  if (status === 'authenticated') {
    return <Redirect href="/" />;
  }

  async function handleGoogleSignIn() {
    setErrorMessage(null);

    if (!isFirebaseConfigured()) {
      setErrorMessage('Firebase public config is not fully configured.');
      return;
    }

    if (!apiUrl) {
      setErrorMessage('EXPO_PUBLIC_API_URL is not configured.');
      return;
    }

    if (!googleWebClientId) {
      setErrorMessage('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not configured.');
      return;
    }

    if (!request) {
      setErrorMessage('Google auth request is not ready yet.');
      return;
    }

    setIsSigningIn(true);

    try {
      const result = await promptAsync();

      if (result.type !== 'success') {
        setErrorMessage(`Google sign-in did not complete: ${result.type}.`);
        setIsSigningIn(false);
        return;
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Google sign-in failed.');
      setIsSigningIn(false);
    }
  }

  async function handleLocalPreviewSignIn() {
    setErrorMessage(null);
    await signInWithLocalPreview();
    router.replace('/');
  }

  return (
    <Screen>
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          Sign in
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          Sign in with Google through Firebase Auth. The Spring Boot backend verifies the Firebase
          ID token before allowing project and task access.
        </ThemedText>
      </ThemedView>

      <ThemedView
        type="backgroundElement"
        style={{ borderCurve: 'continuous', borderRadius: 8, gap: Spacing.two, padding: Spacing.three }}>
        <ThemedText type="smallBold" selectable>
          Google OAuth
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" selectable>
          The app signs in with Firebase on the client, then sends the Firebase ID token to
          `/auth/firebase` so the backend can verify the user.
        </ThemedText>
      </ThemedView>

      {errorMessage ? (
        <FeedbackState title="Sign-in unavailable" message={errorMessage} variant="error" />
      ) : null}

      {!isGoogleConfigured ? (
        <FeedbackState
          title="Configuration needed"
          message="Set EXPO_PUBLIC_API_URL, Firebase public config, and EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to enable real Firebase login."
        />
      ) : null}

      <View style={{ alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
        <ActionButton
          disabled={!request || isSigningIn || !isGoogleConfigured}
          label={isSigningIn ? 'Signing in...' : 'Continue with Google'}
          onPress={handleGoogleSignIn}
        />
        <ActionButton label="Use local preview" onPress={handleLocalPreviewSignIn} />
      </View>
    </Screen>
  );
}
