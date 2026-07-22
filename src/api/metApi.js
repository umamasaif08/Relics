import { CURATED_OBJECT_IDS } from './curatedIds';
import { mapMetObjectToArtifact } from './artifactMapper';

const MET_OBJECT_URL = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';

/**
 * @param {number} id
 * @returns {Promise<import('../types').Artifact | null>}
 */
export async function fetchArtifactById(id) {
  const response = await fetch(`${MET_OBJECT_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch artifact ${id}: ${response.status}`);
  }

  const data = await response.json();
  return mapMetObjectToArtifact(data);
}

/**
 * @param {number[]} [ids]
 * @returns {Promise<import('../types').Artifact[]>}
 */
export async function fetchCuratedArtifacts(ids = CURATED_OBJECT_IDS) {
  const results = await Promise.allSettled(ids.map((id) => fetchArtifactById(id)));

  return results
    .filter((result) => result.status === 'fulfilled' && result.value)
    .map((result) => result.value);
}

export { CURATED_OBJECT_IDS };
