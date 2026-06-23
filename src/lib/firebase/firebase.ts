import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.appId &&
      firebaseConfig.authDomain &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.projectId &&
      firebaseConfig.storageBucket
  );
}

export function getFirebaseAuth(): Auth {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase public config is not fully configured.');
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
}
