import { useMemo, useState } from 'react';
import { useArtifactsContext } from '../context/ArtifactsContext';
import { filterArtifacts } from '../hooks/useArtifacts';
import ArtifactGrid from '../components/ArtifactGrid';
import ErrorState from '../components/ErrorState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import SearchFilters from '../components/SearchFilters';
import FadeIn from '../components/react-bits/FadeIn';

const initialFilters = {
  search: '',
  civilization: '',
  category: '',
  era: '',
};

export default function HomePage() {
  const { artifacts, loading, error, retry, filterOptions } = useArtifactsContext();
  const [filters, setFilters] = useState(initialFilters);

  const filteredArtifacts = useMemo(
    () => filterArtifacts(artifacts, filters),
    [artifacts, filters],
  );

  return (
    <div className="space-y-8">
      <FadeIn>
        <section className="rounded-[2rem] border border-black/5 bg-gradient-to-br from-white via-relic-paper to-[#efe7d7] p-8 dark:border-white/10 dark:from-relic-stone dark:via-relic-ink dark:to-[#12100d]">
          <p className="text-xs uppercase tracking-[0.28em] text-relic-gold-dim dark:text-relic-gold">
            Open Access Collection
          </p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
            Journey through humanity&apos;s greatest relics
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Explore curated masterpieces from Egyptian temples, Greek marbles, Roman rings,
            Asian scrolls, and European galleries — all sourced live from The Met.
          </p>
        </section>
      </FadeIn>

      <SearchFilters filters={filters} onChange={setFilters} options={filterOptions} />

      {loading && <LoadingSkeleton />}
      {!loading && error && <ErrorState message={error} onRetry={retry} />}
      {!loading && !error && (
        <>
          <p className="text-sm text-neutral-500">
            Showing {filteredArtifacts.length} of {artifacts.length} relics
          </p>
          <ArtifactGrid artifacts={filteredArtifacts} />
        </>
      )}
    </div>
  );
}
