import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCuratedArtifacts } from '../api/metApi';

/**
 * @typedef {import('../types').Artifact} Artifact
 */

/**
 * @param {Artifact[]} artifacts
 * @param {{ search: string, civilization: string, category: string, era: string }} filters
 */
export function filterArtifacts(artifacts, filters) {
  const search = filters.search.trim().toLowerCase();

  return artifacts.filter((artifact) => {
    const matchesSearch =
      !search ||
      artifact.title.toLowerCase().includes(search) ||
      artifact.culture.toLowerCase().includes(search) ||
      artifact.artistDisplayName.toLowerCase().includes(search);

    const matchesCivilization =
      !filters.civilization || artifact.civilization === filters.civilization;

    const matchesCategory = !filters.category || artifact.category === filters.category;

    const matchesEra = !filters.era || artifact.era === filters.era;

    return matchesSearch && matchesCivilization && matchesCategory && matchesEra;
  });
}

export function useArtifacts() {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const loadArtifacts = useCallback(async () => {
    if (loaded && artifacts.length > 0) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchCuratedArtifacts();

      if (data.length === 0) {
        throw new Error('No public domain artifacts could be loaded.');
      }

      setArtifacts(data);
      setLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load artifacts.');
    } finally {
      setLoading(false);
    }
  }, [loaded, artifacts.length]);

  useEffect(() => {
    loadArtifacts();
  }, [loadArtifacts]);

  const retry = useCallback(() => {
    setLoaded(false);
    setArtifacts([]);
    loadArtifacts();
  }, [loadArtifacts]);

  const getArtifactById = useCallback(
    (id) => artifacts.find((artifact) => artifact.id === Number(id)),
    [artifacts],
  );

  const filterOptions = useMemo(() => {
    const civilizations = [...new Set(artifacts.map((a) => a.civilization))].sort();
    const categories = [...new Set(artifacts.map((a) => a.category))].sort();
    const eras = [...new Set(artifacts.map((a) => a.era))].sort();

    return { civilizations, categories, eras };
  }, [artifacts]);

  return {
    artifacts,
    loading,
    error,
    retry,
    getArtifactById,
    filterOptions,
  };
}
