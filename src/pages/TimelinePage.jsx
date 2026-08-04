import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useArtifactsContext } from '../context/ArtifactsContext';
import ErrorState from '../components/ErrorState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import FavoriteButton from '../favourites/FavoriteButton';
import FadeIn from '../components/react-bits/FadeIn';

const ERA_ORDER = [
  'Ancient',
  'Medieval',
  'Renaissance & Baroque',
  'Modern',
  'Historical',
  'Unknown Era',
];

function parseYear(dateText) {
  if (!dateText) return 9999;
  const clean = dateText.toLowerCase();
  
  // Look for BCE / BC
  const isBce = /b\.?c\.?e?|b\.?c\.?/i.test(clean);
  
  // Find first sequence of digits
  const match = clean.match(/(\d+)/);
  if (!match) return 9999;
  
  let year = parseInt(match[1], 10);
  if (isBce) {
    year = -year;
  }
  return year;
}

export default function TimelinePage() {
  const { artifacts, loading, error, retry } = useArtifactsContext();

  const timelineData = useMemo(() => {
    if (artifacts.length === 0) return [];

    // Group by Era
    const grouped = artifacts.reduce((acc, artifact) => {
      let era = artifact.era || 'Unknown Era';
      // Normalize era key to match ERA_ORDER or fall back
      if (!ERA_ORDER.includes(era)) {
        if (era.toLowerCase().includes('unknown')) {
          era = 'Unknown Era';
        } else {
          era = 'Historical';
        }
      }
      if (!acc[era]) {
        acc[era] = [];
      }
      acc[era].push(artifact);
      return acc;
    }, {});

    // Sort eras according to ERA_ORDER and sort artifacts within each era chronologically
    return ERA_ORDER.map((era) => {
      const list = grouped[era] || [];
      const sortedList = [...list].sort((a, b) => {
        const yearA = parseYear(a.objectDate);
        const yearB = parseYear(b.objectDate);
        return yearA - yearB;
      });
      return { era, artifacts: sortedList };
    }).filter((group) => group.artifacts.length > 0);
  }, [artifacts]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // navbar offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl font-semibold">Historical Timeline</h1>
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <FadeIn>
        <div className="border-b border-black/5 pb-4 dark:border-white/10">
          <h1 className="font-serif text-3xl font-semibold">Historical Timeline</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Journey through eras chronologically, exploring relics ordered by their creation dates.
          </p>
        </div>
      </FadeIn>

      {/* Sticky Era Shortcuts */}
      <FadeIn delay={0.05}>
        <div className="sticky top-[80px] z-30 -mx-4 flex justify-start gap-2 overflow-x-auto bg-relic-paper/85 px-4 py-3 backdrop-blur dark:bg-relic-ink/85 sm:mx-0 sm:px-0">
          {timelineData.map((group) => (
            <button
              key={group.era}
              onClick={() => scrollToSection(group.era.replace(/\s+/g, '-'))}
              className="shrink-0 rounded-full border border-black/10 bg-white/90 px-3.5 py-1.5 text-xs font-medium transition hover:border-relic-gold hover:text-relic-gold-dim dark:border-white/10 dark:bg-relic-stone dark:text-relic-paper dark:hover:text-relic-gold"
            >
              {group.era} ({group.artifacts.length})
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Timeline List */}
      <div className="relative mx-auto max-w-4xl px-4 md:px-0">
        {/* Central connecting line */}
        <div className="absolute bottom-0 left-[21px] top-4 w-0.5 bg-gradient-to-b from-relic-gold/50 via-relic-gold-dim/30 to-relic-gold/10 md:left-1/2 md:-ml-0.5" />

        <div className="space-y-16">
          {timelineData.map((group, groupIdx) => {
            const eraId = group.era.replace(/\s+/g, '-');
            return (
              <div key={group.era} id={eraId} className="space-y-8 scroll-mt-24">
                {/* Era Marker Header */}
                <div className="flex md:justify-center relative z-10">
                  <span className="rounded-full border border-relic-gold bg-relic-paper px-4 py-1.5 font-serif text-sm font-semibold tracking-wider text-relic-gold-dim shadow-sm dark:bg-relic-ink dark:text-relic-gold">
                    {group.era}
                  </span>
                </div>

                {/* Artifact list within the era */}
                <div className="space-y-8">
                  {group.artifacts.map((artifact, index) => {
                    const isLeft = index % 2 === 0;

                    return (
                      <div
                        key={artifact.id}
                        className={`flex flex-col relative md:flex-row md:items-center ${
                          isLeft ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        {/* Timeline Node dot */}
                        <div className="absolute left-[13px] top-1/2 -mt-2 h-4.5 w-4.5 rounded-full border-4 border-relic-paper bg-relic-gold dark:border-relic-ink md:left-1/2 md:top-1/2 md:-ml-[9px] md:-mt-[9px]" />

                        {/* Content Card Side */}
                        <div className="w-full pl-12 md:w-1/2 md:pl-0 md:px-8">
                          <FadeIn delay={0.05 * (index % 4)}>
                            <div className="group relative rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-relic-stone">
                              <div className="flex gap-4">
                                <Link to={`/artifact/${artifact.id}`} className="shrink-0">
                                  <img
                                    src={artifact.primaryImage}
                                    alt={artifact.title}
                                    className="h-20 w-20 rounded-xl object-cover shadow-sm transition hover:scale-105"
                                  />
                                </Link>

                                <div className="flex-1 space-y-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-relic-gold-dim dark:text-relic-gold">
                                      {artifact.civilization}
                                    </span>
                                    <FavoriteButton artifactId={artifact.id} className="h-6 w-6 border-none bg-transparent dark:bg-transparent shadow-none" />
                                  </div>
                                  <Link to={`/artifact/${artifact.id}`}>
                                    <h4 className="font-serif text-base font-semibold leading-tight text-relic-ink hover:text-relic-gold-dim dark:text-relic-paper dark:hover:text-relic-gold line-clamp-2">
                                      {artifact.title}
                                    </h4>
                                  </Link>
                                  <p className="text-xs text-neutral-500 font-medium">
                                    {artifact.objectDate}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </FadeIn>
                        </div>

                        {/* Date display side */}
                        <div className="hidden md:block md:w-1/2 md:px-8">
                          <div className={`text-sm text-neutral-500 font-serif ${
                            isLeft ? 'text-left' : 'text-right'
                          }`}>
                            <p className="font-semibold text-relic-gold-dim dark:text-relic-gold">
                              {artifact.objectDate}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {artifact.culture || artifact.period}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
