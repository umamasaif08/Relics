import { Link } from 'react-router-dom';
import { useArtifactsContext } from '../context/ArtifactsContext';
import { useFavorites } from '../context/FavoritesContext';
import ArtifactGrid from '../components/ArtifactGrid';
import ErrorState from '../components/ErrorState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import FadeIn from '../components/react-bits/FadeIn';

export default function FavoritesPage() {
  const { artifacts, loading, error, retry } = useArtifactsContext();
  const { favoriteIds } = useFavorites();

  const favoritedArtifacts = artifacts.filter((artifact) =>
    favoriteIds.includes(artifact.id)
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl font-semibold">Your Favorites</h1>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex items-baseline justify-between border-b border-black/5 pb-4 dark:border-white/10">
          <h1 className="font-serif text-3xl font-semibold">Your Favorites</h1>
          <p className="text-sm text-neutral-500">
            {favoritedArtifacts.length} {favoritedArtifacts.length === 1 ? 'relic' : 'relics'} saved
          </p>
        </div>
      </FadeIn>

      {favoritedArtifacts.length === 0 ? (
        <FadeIn delay={0.1}>
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-black/10 px-6 py-16 text-center dark:border-white/10">
            <span className="mb-4 text-4xl text-relic-gold-dim dark:text-relic-gold">♥</span>
            <h2 className="font-serif text-2xl">No favorited relics yet</h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-500">
              Browse the collection and tap the heart icon on any artifact to save it to your personal exhibition.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-relic-gold-dim px-5 py-2.5 text-sm font-medium text-white transition hover:bg-relic-gold dark:bg-relic-gold dark:text-relic-ink dark:hover:bg-relic-gold/90"
            >
              Explore Collection
            </Link>
          </div>
        </FadeIn>
      ) : (
        <FadeIn delay={0.1}>
          <ArtifactGrid artifacts={favoritedArtifacts} />
        </FadeIn>
      )}
    </div>
  );
}
