import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';
import { db } from '../services/firebaseService';

// Firestore path: users/{userId}/favourites/{artifactId}
const favouritesCol = (userId: string) =>
  collection(db, 'users', userId, 'favourites');

const favouriteDoc = (userId: string, artifactId: number) =>
  doc(db, 'users', userId, 'favourites', String(artifactId));

// ─── Add ─────────────────────────────────────────────────────────────────────

/**
 * Adds an artifact to the user's favourites in Firestore.
 * @throws {Error} Readable message if the write fails.
 */
export async function addFavourite(userId: string, artifactId: number): Promise<void> {
  if (!userId) throw new Error('Cannot add favourite: no user is signed in.');
  if (!artifactId) throw new Error('Cannot add favourite: artifactId is required.');

  try {
    await setDoc(favouriteDoc(userId, artifactId), {
      artifactId,
      addedAt: serverTimestamp(),
    });
  } catch (err) {
    throw new Error(
      `Failed to add artifact ${artifactId} to favourites. Please try again. (${(err as Error).message})`
    );
  }
}

// ─── Remove ──────────────────────────────────────────────────────────────────

/**
 * Removes an artifact from the user's favourites in Firestore.
 * @throws {Error} Readable message if the delete fails.
 */
export async function removeFavourite(userId: string, artifactId: number): Promise<void> {
  if (!userId) throw new Error('Cannot remove favourite: no user is signed in.');
  if (!artifactId) throw new Error('Cannot remove favourite: artifactId is required.');

  try {
    await deleteDoc(favouriteDoc(userId, artifactId));
  } catch (err) {
    throw new Error(
      `Failed to remove artifact ${artifactId} from favourites. Please try again. (${(err as Error).message})`
    );
  }
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

/**
 * Adds the artifact if it is not already favourited; removes it if it is.
 * Returns true if the artifact is now a favourite, false if it was removed.
 * @throws {Error} Readable message if the operation fails.
 */
export async function toggleFavourite(userId: string, artifactId: number): Promise<boolean> {
  const already = await isFavourite(userId, artifactId);
  if (already) {
    await removeFavourite(userId, artifactId);
    return false;
  }
  await addFavourite(userId, artifactId);
  return true;
}

// ─── Fetch all ───────────────────────────────────────────────────────────────

/**
 * Returns all artifact IDs the user has favourited.
 * @throws {Error} Readable message if the read fails.
 */
export async function fetchFavouriteIds(userId: string): Promise<number[]> {
  if (!userId) throw new Error('Cannot fetch favourites: no user is signed in.');

  try {
    const snapshot = await getDocs(favouritesCol(userId));
    return snapshot.docs.map((d) => Number(d.id));
  } catch (err) {
    throw new Error(
      `Failed to load your favourites. Please refresh and try again. (${(err as Error).message})`
    );
  }
}

// ─── Check single ─────────────────────────────────────────────────────────────

/**
 * Returns true if the given artifact is in the user's favourites.
 * @throws {Error} Readable message if the read fails.
 */
export async function isFavourite(userId: string, artifactId: number): Promise<boolean> {
  if (!userId) throw new Error('Cannot check favourite: no user is signed in.');
  if (!artifactId) throw new Error('Cannot check favourite: artifactId is required.');

  try {
    const snapshot = await getDoc(favouriteDoc(userId, artifactId));
    return snapshot.exists();
  } catch (err) {
    throw new Error(
      `Failed to check favourite status for artifact ${artifactId}. (${(err as Error).message})`
    );
  }
}

// ─── Real-time listener ───────────────────────────────────────────────────────

/**
 * Subscribes to the user's favourites collection in real time.
 * Calls onUpdate with the latest array of artifact IDs on every change.
 * Calls onError with a readable message if the subscription fails.
 * Returns the unsubscribe function — call it to stop listening.
 */
export function subscribeFavourites(
  userId: string,
  onUpdate: (ids: number[]) => void,
  onError: (message: string) => void,
): Unsubscribe {
  if (!userId) {
    onError('Cannot subscribe to favourites: no user is signed in.');
    return () => {};
  }

  return onSnapshot(
    favouritesCol(userId),
    (snapshot) => {
      const ids = snapshot.docs.map((d) => Number(d.id));
      onUpdate(ids);
    },
    (err) => {
      onError(
        `Lost connection to your favourites. Please refresh. (${err.message})`
      );
    },
  );
}

// Firestore path: users/{userId}/favourites/{artifactId}
const favouritesCol = (userId: string) =>
  collection(db, 'users', userId, 'favourites');

const favouriteDoc = (userId: string, artifactId: number) =>
  doc(db, 'users', userId, 'favourites', String(artifactId));

// ─── Add ─────────────────────────────────────────────────────────────────────

/**
 * Adds an artifact to the user's favourites in Firestore.
 * @throws {Error} Readable message if the write fails.
 */
export async function addFavourite(userId: string, artifactId: number): Promise<void> {
  if (!userId) throw new Error('Cannot add favourite: no user is signed in.');
  if (!artifactId) throw new Error('Cannot add favourite: artifactId is required.');

  try {
    await setDoc(favouriteDoc(userId, artifactId), {
      artifactId,
      addedAt: serverTimestamp(),
    });
  } catch (err) {
    throw new Error(
      `Failed to add artifact ${artifactId} to favourites. Please try again. (${(err as Error).message})`
    );
  }
}

// ─── Remove ──────────────────────────────────────────────────────────────────

/**
 * Removes an artifact from the user's favourites in Firestore.
 * @throws {Error} Readable message if the delete fails.
 */
export async function removeFavourite(userId: string, artifactId: number): Promise<void> {
  if (!userId) throw new Error('Cannot remove favourite: no user is signed in.');
  if (!artifactId) throw new Error('Cannot remove favourite: artifactId is required.');

  try {
    await deleteDoc(favouriteDoc(userId, artifactId));
  } catch (err) {
    throw new Error(
      `Failed to remove artifact ${artifactId} from favourites. Please try again. (${(err as Error).message})`
    );
  }
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

/**
 * Adds the artifact if it is not already favourited; removes it if it is.
 * Returns true if the artifact is now a favourite, false if it was removed.
 * @throws {Error} Readable message if the operation fails.
 */
export async function toggleFavourite(userId: string, artifactId: number): Promise<boolean> {
  const already = await isFavourite(userId, artifactId);
  if (already) {
    await removeFavourite(userId, artifactId);
    return false;
  }
  await addFavourite(userId, artifactId);
  return true;
}

// ─── Fetch all ───────────────────────────────────────────────────────────────

/**
 * Returns all artifact IDs the user has favourited.
 * @throws {Error} Readable message if the read fails.
 */
export async function fetchFavouriteIds(userId: string): Promise<number[]> {
  if (!userId) throw new Error('Cannot fetch favourites: no user is signed in.');

  try {
    const snapshot = await getDocs(favouritesCol(userId));
    return snapshot.docs.map((d) => Number(d.id));
  } catch (err) {
    throw new Error(
      `Failed to load your favourites. Please refresh and try again. (${(err as Error).message})`
    );
  }
}

// ─── Check single ─────────────────────────────────────────────────────────────

/**
 * Returns true if the given artifact is in the user's favourites.
 * @throws {Error} Readable message if the read fails.
 */
export async function isFavourite(userId: string, artifactId: number): Promise<boolean> {
  if (!userId) throw new Error('Cannot check favourite: no user is signed in.');
  if (!artifactId) throw new Error('Cannot check favourite: artifactId is required.');

  try {
    const snapshot = await getDoc(favouriteDoc(userId, artifactId));
    return snapshot.exists();
  } catch (err) {
    throw new Error(
      `Failed to check favourite status for artifact ${artifactId}. (${(err as Error).message})`
    );
  }
}
