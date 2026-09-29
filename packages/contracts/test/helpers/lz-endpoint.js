import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import hre from "hardhat";

/**
 * Loads the precompiled EndpointV2Mock artifact shipped inside
 * `@layerzerolabs/test-devtools-evm-hardhat`. The package `exports` map only
 * exposes "." and "./package.json", so the artifact is resolved from the
 * package root (via the exported package.json) and read directly from disk.
 *
 * EVOLVE inherits OFT: its constructor calls `endpoint.setDelegate(delegate)`,
 * so a live endpoint (even the no-op mock) is required at deploy time —
 * passing a zero address reverts.
 */
function loadEndpointV2MockArtifact() {
  const require = createRequire(import.meta.url);
  const artifactRel = join(
    "artifacts",
    "contracts",
    "mocks",
    "EndpointV2Mock.sol",
    "EndpointV2Mock.json",
  );
  const candidates = [];
  try {
    const pkgJson = require.resolve("@layerzerolabs/test-devtools-evm-hardhat/package.json");
    candidates.push(join(dirname(pkgJson), artifactRel));
  } catch {
    // exports map unavailable — fall through to hoisted paths
  }
  candidates.push(
    join(process.cwd(), "node_modules", "@layerzerolabs", "test-devtools-evm-hardhat", artifactRel),
  );
  candidates.push(
    join(
      process.cwd(),
      "..",
      "..",
      "node_modules",
      "@layerzerolabs",
      "test-devtools-evm-hardhat",
      artifactRel,
    ),
  );
  for (const candidate of candidates) {
    try {
      return JSON.parse(readFileSync(candidate, "utf8"));
    } catch {
      // try next candidate
    }
  }
  throw new Error("EndpointV2Mock artifact not found in @layerzerolabs/test-devtools-evm-hardhat");
}

/**
 * Deploys the real LayerZero `EndpointV2Mock` (same double used by LayerZero's
 * own test suites). Requires `allowUnlimitedContractSize` on the hardhat
 * network (see hardhat.config.js) — the mock bytecode is ~26KB.
 *
 * A single mock endpoint can be shared by every EVOLVE deployment in a
 * fixture; `setDelegate` on the mock is a no-op.
 */
export async function deployLzEndpointMock(deployer, eid = 1) {
  const artifact = loadEndpointV2MockArtifact();
  const factory = new hre.ethers.ContractFactory(artifact.abi, artifact.bytecode, deployer);
  return factory.deploy(eid);
}
