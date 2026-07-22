import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useArtifactsContext } from '../context/ArtifactsContext';
import ErrorState from '../components/ErrorState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import FadeIn from '../components/react-bits/FadeIn';

export default function ComparePage() {
  const { artifacts, loading, error, retry } = useArtifactsContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const idA = searchParams.get('a') ? Number(searchParams.get('a')) : null;
  const idB = searchParams.get('b') ? Number(searchParams.get('b')) : null;

  const artifactA = useMemo(() => artifacts.find((a) => a.id === idA), [artifacts, idA]);
  const artifactB = useMemo(() => artifacts.find((a) => a.id === idB), [artifacts, idB]);

  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  const containerRefA = useRef(null);
  const containerRefB = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRefA.current && !containerRefA.current.contains(event.target)) {
        setShowDropdownA(false);
      }
      if (containerRefB.current && !containerRefB.current.contains(event.target)) {
        setShowDropdownB(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (slot, id) => {
    const nextParams = new URLSearchParams(searchParams);
    if (id) {
      nextParams.set(slot, id.toString());
    } else {
      nextParams.delete(slot);
    }
    setSearchParams(nextParams);
    if (slot === 'a') {
      setSearchA('');
      setShowDropdownA(false);
    } else {
      setSearchB('');
      setShowDropdownB(false);
    }
  };

  // Filter lists for selection
  const filteredOptionsA = useMemo(() => {
    return artifacts.filter((art) => {
      if (art.id === idB) return false; // Can't compare with itself
      const query = searchA.toLowerCase();
      return (
        art.title.toLowerCase().includes(query) ||
        art.civilization.toLowerCase().includes(query) ||
        art.culture.toLowerCase().includes(query)
      );
    });
  }, [artifacts, searchA, idB]);

  const filteredOptionsB = useMemo(() => {
    return artifacts.filter((art) => {
      if (art.id === idA) return false; // Can't compare with itself
      const query = searchB.toLowerCase();
      return (
        art.title.toLowerCase().includes(query) ||
        art.civilization.toLowerCase().includes(query) ||
        art.culture.toLowerCase().includes(query)
      );
    });
  }, [artifacts, searchB, idA]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl font-semibold">Compare Relics</h1>
        <LoadingSkeleton count={2} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  // Highlight rules
  const isSameCivilization = artifactA && artifactB && artifactA.civilization === artifactB.civilization;
  const isSameEra = artifactA && artifactB && artifactA.era === artifactB.era;

  const comparisonRows = [
    { label: 'Civilization', key: 'civilization', highlight: isSameCivilization },
    { label: 'Era', key: 'era', highlight: isSameEra },
    { label: 'Culture', key: 'culture' },
    { label: 'Period', key: 'period' },
    { label: 'Date', key: 'objectDate' },
    { label: 'Medium', key: 'medium' },
    { label: 'Category', key: 'category' },
    { label: 'Country', key: 'country' },
    { label: 'Dynasty', key: 'dynasty' },
    { label: 'Reign', key: 'reign' },
    { label: 'Dimensions', key: 'dimensions' },
    { label: 'Credit Line', key: 'creditLine' },
  ];

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="border-b border-black/5 pb-4 dark:border-white/10">
          <h1 className="font-serif text-3xl font-semibold">Compare Relics</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Select two artifacts to contrast their historical details, civilizations, and mediums.
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Slot A */}
        <FadeIn delay={0.05}>
          <div
            ref={containerRefA}
            className="relative flex flex-col rounded-3xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-relic-stone"
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Relic A</h3>
            {artifactA ? (
              <div className="relative flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleSelect('a', null)}
                  className="absolute right-0 top-0 rounded-full border border-black/10 bg-white/90 p-1.5 text-xs text-neutral-500 transition hover:border-red-500 hover:text-red-500 dark:border-white/10 dark:bg-relic-stone dark:text-neutral-400"
                  aria-label="Clear Relic A"
                >
                  ✕ Clear
                </button>
                <img
                  src={artifactA.primaryImage}
                  alt={artifactA.title}
                  className="aspect-square h-44 rounded-2xl object-cover shadow-sm"
                />
                <h4 className="mt-4 font-serif text-xl font-semibold text-center">{artifactA.title}</h4>
                <p className="mt-1 text-sm text-relic-gold-dim dark:text-relic-gold">{artifactA.civilization}</p>
                <Link
                  to={`/artifact/${artifactA.id}`}
                  className="mt-3 text-xs text-neutral-500 underline hover:text-relic-gold"
                >
                  View Details
                </Link>
              </div>
            ) : (
              <div className="flex min-h-[220px] flex-col justify-center">
                <input
                  type="text"
                  placeholder="Search and select Relic A..."
                  value={searchA}
                  onChange={(e) => {
                    setSearchA(e.target.value);
                    setShowDropdownA(true);
                  }}
                  onFocus={() => setShowDropdownA(true)}
                  className="w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-sm outline-none transition focus:border-relic-gold dark:border-white/10 dark:bg-neutral-900"
                />
                {showDropdownA && (
                  <div className="absolute left-6 right-6 top-[7.5rem] z-20 max-h-60 overflow-y-auto rounded-xl border border-black/5 bg-white shadow-xl dark:border-white/10 dark:bg-relic-stone">
                    {filteredOptionsA.length === 0 ? (
                      <p className="p-3 text-xs text-neutral-400">No matching relics found</p>
                    ) : (
                      filteredOptionsA.map((art) => (
                        <button
                          key={art.id}
                          type="button"
                          onClick={() => handleSelect('a', art.id)}
                          className="flex w-full items-center gap-3 border-b border-black/5 p-2 text-left text-sm hover:bg-neutral-50 dark:border-white/10 dark:hover:bg-neutral-800"
                        >
                          <img
                            src={art.primaryImage}
                            alt=""
                            className="h-8 w-8 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium line-clamp-1">{art.title}</p>
                            <p className="text-xs text-neutral-400">{art.civilization} • {art.era}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 py-8 dark:border-white/10">
                  <span className="text-3xl text-neutral-300 dark:text-neutral-700">+</span>
                  <p className="text-xs text-neutral-400 mt-1">Select an artifact to compare</p>
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Slot B */}
        <FadeIn delay={0.1}>
          <div
            ref={containerRefB}
            className="relative flex flex-col rounded-3xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-relic-stone"
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Relic B</h3>
            {artifactB ? (
              <div className="relative flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleSelect('b', null)}
                  className="absolute right-0 top-0 rounded-full border border-black/10 bg-white/90 p-1.5 text-xs text-neutral-500 transition hover:border-red-500 hover:text-red-500 dark:border-white/10 dark:bg-relic-stone dark:text-neutral-400"
                  aria-label="Clear Relic B"
                >
                  ✕ Clear
                </button>
                <img
                  src={artifactB.primaryImage}
                  alt={artifactB.title}
                  className="aspect-square h-44 rounded-2xl object-cover shadow-sm"
                />
                <h4 className="mt-4 font-serif text-xl font-semibold text-center">{artifactB.title}</h4>
                <p className="mt-1 text-sm text-relic-gold-dim dark:text-relic-gold">{artifactB.civilization}</p>
                <Link
                  to={`/artifact/${artifactB.id}`}
                  className="mt-3 text-xs text-neutral-500 underline hover:text-relic-gold"
                >
                  View Details
                </Link>
              </div>
            ) : (
              <div className="flex min-h-[220px] flex-col justify-center">
                <input
                  type="text"
                  placeholder="Search and select Relic B..."
                  value={searchB}
                  onChange={(e) => {
                    setSearchB(e.target.value);
                    setShowDropdownB(true);
                  }}
                  onFocus={() => setShowDropdownB(true)}
                  className="w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-sm outline-none transition focus:border-relic-gold dark:border-white/10 dark:bg-neutral-900"
                />
                {showDropdownB && (
                  <div className="absolute left-6 right-6 top-[7.5rem] z-20 max-h-60 overflow-y-auto rounded-xl border border-black/5 bg-white shadow-xl dark:border-white/10 dark:bg-relic-stone">
                    {filteredOptionsB.length === 0 ? (
                      <p className="p-3 text-xs text-neutral-400">No matching relics found</p>
                    ) : (
                      filteredOptionsB.map((art) => (
                        <button
                          key={art.id}
                          type="button"
                          onClick={() => handleSelect('b', art.id)}
                          className="flex w-full items-center gap-3 border-b border-black/5 p-2 text-left text-sm hover:bg-neutral-50 dark:border-white/10 dark:hover:bg-neutral-800"
                        >
                          <img
                            src={art.primaryImage}
                            alt=""
                            className="h-8 w-8 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium line-clamp-1">{art.title}</p>
                            <p className="text-xs text-neutral-400">{art.civilization} • {art.era}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 py-8 dark:border-white/10">
                  <span className="text-3xl text-neutral-300 dark:text-neutral-700">+</span>
                  <p className="text-xs text-neutral-400 mt-1">Select an artifact to compare</p>
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Comparison Details */}
      {(artifactA || artifactB) && (
        <FadeIn delay={0.15}>
          <div className="rounded-[2rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-relic-stone">
            <h3 className="mb-6 font-serif text-2xl font-semibold border-b border-black/5 pb-3 dark:border-white/10">
              Comparative Analysis
            </h3>
            <div className="space-y-1">
              {comparisonRows.map((row) => {
                const valA = artifactA ? artifactA[row.key] || 'N/A' : '—';
                const valB = artifactB ? artifactB[row.key] || 'N/A' : '—';

                // Skip if both are unavailable
                if (valA === '—' && valB === '—') return null;

                return (
                  <div
                    key={row.key}
                    className={`grid grid-cols-[1fr_120px_1fr] gap-4 py-4 border-b border-black/5 dark:border-white/10 items-center text-sm ${
                      row.highlight
                        ? 'bg-relic-gold/5 rounded-xl border-x border-black/5 dark:border-white/5'
                        : ''
                    }`}
                  >
                    <div className="text-right pr-4 font-medium text-relic-ink dark:text-relic-paper">
                      {valA}
                    </div>
                    <div className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500">
                      {row.label}
                      {row.highlight && (
                        <span className="block text-[10px] text-relic-gold-dim dark:text-relic-gold font-bold">
                          ✓ MATCH
                        </span>
                      )}
                    </div>
                    <div className="text-left pl-4 font-medium text-relic-ink dark:text-relic-paper">
                      {valB}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
