import { Link, useParams } from 'react-router-dom';
import { useArtifactsContext } from '../context/ArtifactsContext';
import ErrorState from '../components/ErrorState';
import FavoriteButton from '../favourites/FavoriteButton';
import LoadingSkeleton from '../components/LoadingSkeleton';
import FadeIn from '../components/react-bits/FadeIn';

function DetailField({ label, value }) {
  if (!value) return null;

  return (
    <div className="rounded-2xl border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-relic-stone/70">
      <dt className="text-xs uppercase tracking-[0.16em] text-neutral-500">{label}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-relic-ink dark:text-relic-paper">{value}</dd>
    </div>
  );
}

export default function DetailPage() {
  const { id } = useParams();
  const { getArtifactById, loading, error, retry } = useArtifactsContext();
  const artifact = getArtifactById(id);

  if (loading) {
    return (
      <div className="space-y-6">
        <Link to="/" className="text-sm text-relic-gold-dim hover:underline dark:text-relic-gold">
          ← Back to collection
        </Link>
        <LoadingSkeleton count={1} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  if (!artifact) {
    return (
      <div className="rounded-3xl border border-dashed border-black/10 px-6 py-16 text-center dark:border-white/10">
        <h2 className="font-serif text-3xl">Relic not found</h2>
        <Link to="/" className="mt-4 inline-block text-relic-gold-dim hover:underline dark:text-relic-gold">
          Return to collection
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <Link to="/" className="text-sm text-relic-gold-dim hover:underline dark:text-relic-gold">
          ← Back to collection
        </Link>
      </FadeIn>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <FadeIn delay={0.05}>
          <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white dark:border-white/10 dark:bg-relic-stone">
            <img
              src={artifact.primaryImage}
              alt={artifact.title}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </FadeIn>

        <div className="space-y-6">
          <FadeIn delay={0.1}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-relic-gold-dim dark:text-relic-gold">
                  {artifact.civilization}
                </p>
                <h1 className="mt-2 font-serif text-4xl leading-tight md:text-5xl">{artifact.title}</h1>
                {artifact.artistDisplayName && (
                  <p className="mt-3 text-neutral-600 dark:text-neutral-400">{artifact.artistDisplayName}</p>
                )}
              </div>
              <FavoriteButton artifactId={artifact.id} className="shrink-0" />
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <dl className="grid gap-3 sm:grid-cols-2">
              <DetailField label="Culture" value={artifact.culture} />
              <DetailField label="Period" value={artifact.period} />
              <DetailField label="Date" value={artifact.objectDate} />
              <DetailField label="Era" value={artifact.era} />
              <DetailField label="Medium" value={artifact.medium} />
              <DetailField label="Category" value={artifact.category} />
              <DetailField label="Department" value={artifact.department} />
              <DetailField label="Country" value={artifact.country} />
              <DetailField label="Dynasty" value={artifact.dynasty} />
              <DetailField label="Reign" value={artifact.reign} />
              <DetailField label="Dimensions" value={artifact.dimensions} />
              <DetailField label="Credit" value={artifact.creditLine} />
            </dl>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-wrap gap-3">
              {artifact.objectURL && (
                <a
                  href={artifact.objectURL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-relic-gold/30 px-5 py-2.5 text-sm text-relic-gold-dim transition hover:bg-relic-gold/10 dark:text-relic-gold"
                >
                  View on metmuseum.org →
                </a>
              )}
              <Link
                to={`/compare?a=${artifact.id}`}
                className="inline-flex rounded-full bg-relic-gold-dim px-5 py-2.5 text-sm font-medium text-white transition hover:bg-relic-gold dark:bg-relic-gold dark:text-relic-ink dark:hover:bg-relic-gold/90"
              >
                Compare this Relic ⇄
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
