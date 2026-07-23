import { fetchCuratedArtifacts } from './src/api/metApi.js';

async function run() {
  console.log('Starting pipeline verification test...');
  try {
    const start = Date.now();
    const artifacts = await fetchCuratedArtifacts();
    const duration = Date.now() - start;

    console.log(`Pipeline fetched ${artifacts.length} artifacts in ${(duration / 1000).toFixed(2)} seconds`);

    if (artifacts.length >= 20 && artifacts.length <= 25) {
      console.log('✅ Pipeline test passed! Collected target number of valid artifacts successfully.');
    } else {
      console.error(`❌ Pipeline test failed! Expected between 20 and 25 valid artifacts, but got ${artifacts.length}`);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Pipeline test failed with error:', err);
    process.exit(1);
  }
}

run();
