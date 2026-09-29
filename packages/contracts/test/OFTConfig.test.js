import { expect } from 'chai';
import { NETWORKS, buildPeerMatrix, buildDvnConfig, assertDvnMinimum } from '../script/lib/oft-config.mjs';

describe('OFTConfig', () => {
  it('every network has requiredDVNs.length >= 2', () => {
    for (const name in NETWORKS) {
      expect(NETWORKS[name].requiredDVNs.length).to.be.at.least(2);
    }
  });

  it('peer matrix is complete and symmetric', () => {
    const matrix = buildPeerMatrix(NETWORKS);
    const n = Object.keys(NETWORKS).length;
    expect(matrix.length).to.equal(n * (n - 1));

    for (const pair of matrix) {
      const reversePair = matrix.find(p => p.fromEid === pair.toEid && p.toEid === pair.fromEid);
      expect(reversePair, `Missing reverse pair for ${pair.fromEid}->${pair.toEid}`).to.not.be.undefined;
    }
  });

  it('assertDvnMinimum throws when a network is given < 2 DVNs', () => {
    const badNetworks = {
      test: { eid: 1, requiredDVNs: ["0x1"] }
    };
    expect(() => assertDvnMinimum(badNetworks, 2)).to.throw(/fewer than 2 required DVNs/);
  });
});
