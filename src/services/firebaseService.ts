import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Signs in anonymously if no user is currently authenticated.
 * Returns the current or newly created user.
 * @throws {Error} Readable message if sign-in fails.
 */
export async function ensureSignedIn(): Promise<User> {
  if (auth.currentUser) return auth.currentUser;

  try {
    const credential = await signInAnonymously(auth);
    return credential.user;
  } catch (err) {
    throw new Error(
      `Could not sign in anonymously. Check your Firebase project has Anonymous sign-in enabled. (${(err as Error).message})`
    );
  }
}

/**
 * Subscribes to auth state changes.
 * Returns the unsubscribe function.
 */
export function onUserChanged(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
