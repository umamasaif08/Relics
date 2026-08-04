import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ensureSignedIn, onUserChanged } from '../services/firebaseService';
import { addFavourite, removeFavourite, subscribeFavourites } from './favouritesService';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [syncError, setSyncError] = useState(null);
  // Tracks in-flight optimistic updates so the UI stays instant
  const pendingRef = useRef(new Set());

  // ── 1. Sign in anonymously once, then track auth state ──────────────────
  useEffect(() => {
    ensureSignedIn().catch((err) => setSyncError(err.message));

    const unsubAuth = onUserChanged((user) => {
      setUserId(user ? user.uid : null);
    });

    return unsubAuth;
  }, []);

  // ── 2. Subscribe to Firestore once we have a userId ──────────────────────
  useEffect(() => {
    if (!userId) return;

    const unsubSnap = subscribeFavourites(
      userId,
      (ids) => {
        // Merge: keep any optimistic ids that Firestore hasn't confirmed yet,
        // then let Firestore overwrite once it catches up.
        setFavoriteIds(ids);
        setSyncError(null);
      },
      (message) => setSyncError(message),
    );

    return unsubSnap;
  }, [userId]);

  // ── 3. Toggle: optimistic update + Firestore write ───────────────────────
  const toggleFavorite = (id) => {
    if (!userId) {
      setSyncError('Sign-in is still loading. Please try again in a moment.');
      return;
    }

    const isCurrentlyFav = favoriteIds.includes(id);

    // Optimistic update — flip immediately so the heart responds at once
    setFavoriteIds((current) =>
      isCurrentlyFav ? current.filter((i) => i !== id) : [...current, id],
    );
    pendingRef.current.add(id);

    const operation = isCurrentlyFav
      ? removeFavourite(userId, id)
      : addFavourite(userId, id);

    operation
      .catch((err) => {
        // Roll back the optimistic update on failure
        setFavoriteIds((current) =>
          isCurrentlyFav ? [...current, id] : current.filter((i) => i !== id),
        );
        setSyncError(err.message);
      })
      .finally(() => {
        pendingRef.current.delete(id);
      });
  };

  const isFavorite = (id) => favoriteIds.includes(id);

  const value = useMemo(
    () => ({
      favoriteIds,
      toggleFavorite,
      isFavorite,
      syncError,
      userId,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [favoriteIds, syncError, userId],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
