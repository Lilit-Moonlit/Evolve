/*
 * Caveats:
 * - zkSync Era, Aurora, Celo, Cronos may require separate adapters/compilers.
 * - DVN addresses are placeholders and require confirmation.
 * - --execute (peer + endpoint setConfig, configType 2/3) is out of scope for this dry-run.
 */

import { NETWORKS, buildDvnConfig, assertDvnMinimum } from './lib/oft-config.mjs';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

if (isDryRun) {
  console.log('Running dry-run configuration check...');
  try {
    assertDvnMinimum(NETWORKS, 2);
    for (const name in NETWORKS) {
      console.log(`${name}: ${NETWORKS[name].requiredDVNs.length} required DVNs`);
    }
    console.log('Dry-run successful.');
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
} else {
  console.log('Execution mode not implemented.');
  process.exit(1);
}
