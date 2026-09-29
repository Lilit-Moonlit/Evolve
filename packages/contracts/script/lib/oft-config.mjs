export const NETWORKS = {
  arbitrum: { eid: 30110, requiredDVNs: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"] }, // TODO(verify): confirm DVN address for arbitrum
  avalanche: { eid: 30106, requiredDVNs: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"] }, // TODO(verify): confirm DVN address for avalanche
  polygon: { eid: 30109, requiredDVNs: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"] }, // TODO(verify): confirm DVN address for polygon
  optimism: { eid: 30111, requiredDVNs: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"] }, // TODO(verify): confirm DVN address for optimism
  zksync: { eid: 30165, requiredDVNs: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"] }, // TODO(verify): confirm DVN address for zksync
  base: { eid: 30184, requiredDVNs: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"] }, // TODO(verify): confirm DVN address for base
  bsc: { eid: 30102, requiredDVNs: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"] }, // TODO(verify): confirm DVN address for bsc
  fantom: { eid: 30112, requiredDVNs: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"] }, // TODO(verify): confirm DVN address for fantom
  aurora: { eid: 30211, requiredDVNs: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"] }, // TODO(verify): confirm DVN address for aurora
  celo: { eid: 30125, requiredDVNs: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"] }, // TODO(verify): confirm DVN address for celo
  cronos: { eid: 30183, requiredDVNs: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"] }, // TODO(verify): confirm DVN address for cronos
};

export function buildPeerMatrix(networks) {
  const names = Object.keys(networks);
  const matrix = [];
  for (const from of names) {
    for (const to of names) {
      if (from === to) continue;
      matrix.push({ fromEid: networks[from].eid, toEid: networks[to].eid });
    }
  }
  return matrix;
}

export function buildDvnConfig(networks) {
  const config = {};
  for (const name in networks) {
    config[networks[name].eid] = {
      requiredDVNs: networks[name].requiredDVNs,
      optionalDVNs: [],
    };
  }
  return config;
}

export function assertDvnMinimum(networks, min = 2) {
  for (const name in networks) {
    if (networks[name].requiredDVNs.length < min) {
      throw new Error(`Network ${name} has fewer than ${min} required DVNs`);
    }
  }
}
