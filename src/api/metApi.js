import { CURATED_OBJECT_IDS } from './curatedIds.js';
import { mapMetObjectToArtifact } from './artifactMapper.js';

const MET_OBJECT_URL = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';

/**
 * @param {number} id
 * @returns {Promise<import('../types').Artifact | null>}
 */
export async function fetchArtifactById(id) {
  const headers = {};
  if (typeof window === 'undefined') {
    headers['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  }

  const response = await fetch(`${MET_OBJECT_URL}/${id}`, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch artifact ${id}: ${response.status}`);
  }

  const data = await response.json();
  return mapMetObjectToArtifact(data);
}

const BATCH_SIZE = 6;
const BATCH_DELAY_MS = 400;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCuratedArtifacts(ids = CURATED_OBJECT_IDS) {
  const validArtifacts = [];
  let totalFetched = 0;
  let totalExcluded = 0;
  let totalFailed = 0;

  const pool = [...ids];
  let poolIndex = 0;

  while (validArtifacts.length < 25 && poolIndex < pool.length) {
    const batchIds = pool.slice(poolIndex, poolIndex + BATCH_SIZE);
    poolIndex += BATCH_SIZE;

    const batchPromises = batchIds.map(async (id) => {
      totalFetched++;
      try {
        const artifact = await fetchArtifactById(id);
        if (artifact === null) {
          totalExcluded++;
          return null;
        }
        return artifact;
      } catch (err) {
        totalFailed++;
        return null;
      }
    });

    const results = await Promise.all(batchPromises);

    for (const item of results) {
      if (item !== null && validArtifacts.length < 25) {
        validArtifacts.push(item);
      }
    }

    if (validArtifacts.length < 25 && poolIndex < pool.length) {
      await delay(BATCH_DELAY_MS);
    }
  }

  console.log(
    `[Resilient Fetch] Total Fetched: ${totalFetched}, Total Excluded by Filter: ${totalExcluded}, Total Failed by Error: ${totalFailed}, Total Valid Stored: ${validArtifacts.length}`
  );

  return validArtifacts;
}

export { CURATED_OBJECT_IDS };
