import { useFavorites } from '../context/FavoritesContext';

export default function FavoriteButton({ artifactId, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(artifactId);

  return (
    <button
      type="button"
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(artifactId);
      }}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/90 text-lg backdrop-blur transition hover:scale-105 dark:border-white/10 dark:bg-relic-stone/90 ${className}`}
    >
      <span className={active ? 'text-red-500' : 'text-neutral-400'}>{active ? '♥' : '♡'}</span>
    </button>
  );
}
