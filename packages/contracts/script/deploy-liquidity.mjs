/**
 * EVOLVE liquidity provisioning + LP locking (SAFE, dry-run by default).
 *
 * Ops wrapper around the EXISTING `src/LiquidityLocker.sol` — deploys nothing,
 * changes no contract. Reads the plan from `../liquidity-setup.json`, validates it,
 * and only with an explicit `--execute` provisions liquidity via the DEX router and
 * locks the received LP tokens via `LiquidityLocker.lock(lpToken, amount)`.
 *
 * Safety rules:
 *   - DRY-RUN is the default. No env vars are read and no chain connection is made
 *     unless `--execute` is passed (ethers/dotenv are imported dynamically inside
 *     the execute branch, never at module top-level).
 *   - Fail-closed: ANY invalid network entry refuses broadcasting for ALL networks.
 *   - `tokenAddress` must be `0x` + 40 hex chars on every network before anything
 *     can proceed (EVOLVE currently exists only on Sepolia — Arbitrum/Avalanche
 *     entries are empty on purpose and will be refused).
 *
 * Usage:
 *   node script/deploy-liquidity.mjs             # dry-run (default)
 *   node script/deploy-liquidity.mjs --dry-run   # same as default
 *   node script/deploy-liquidity.mjs --execute   # opt-in broadcast
 *
 * Environment (--execute only; PRIVATE_KEY matches script/deploy-sepolia.mjs):
 *   PRIVATE_KEY         deployer EOA holding EVOLVE + native funds
 *   ARBITRUM_RPC_URL    Arbitrum RPC endpoint
 *   AVALANCHE_RPC_URL   Avalanche RPC endpoint
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, "..", "liquidity-setup.json");

const USAGE = `Usage:
  node script/deploy-liquidity.mjs             # dry-run (default)
  node script/deploy-liquidity.mjs --dry-run   # dry-run
  node script/deploy-liquidity.mjs --execute   # broadcast (opt-in)`;

// Canonical public periphery addresses (public constants, NOT secrets, NOT RPCs).
// Overridable per network via "routerAddress" / "wethAddress" in liquidity-setup.json.
const DEX_ROUTERS = {
  "uniswap-v3": {
    label: "Uniswap V3 NonfungiblePositionManager",
    defaultAddress: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  },
  "trader-joe": {
    label: "Trader Joe Router02",
    defaultAddress: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
  },
};
const WETH_BY_NETWORK = {
  arbitrum: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  avalanche: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
};
const RPC_ENV_BY_NETWORK = {
  arbitrum: "ARBITRUM_RPC_URL",
  avalanche: "AVALANCHE_RPC_URL",
};
const JOE_FACTORY = "0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10";
const MAX_TICK = 887220; // full range for tick spacing 60 (0.3% fee tier)
const SLIPPAGE_BPS = 100n; // 1% protection on desired amounts

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
];
const WETH_ABI = ["function deposit() payable", ...ERC20_ABI];
const LOCKER_ABI = ["function lock(address lpToken, uint256 amount)"];
const POSITION_MANAGER_ABI = [
  "function mint((address tokenA, address tokenB, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)",
];
const JOE_ROUTER_ABI = [
  "function addLiquidityAVAX(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountAVAXMin, address to, uint256 deadline) payable returns (uint256 amountToken, uint256 amountAVAX, uint256 liquidity)",
];
const JOE_FACTORY_ABI = [
  "function getPair(address tokenA, address tokenB) view returns (address pair)",
];

function parseArgs(argv) {
  if (argv.length === 0) return "dry-run";
  if (argv.length === 1 && argv[0] === "--dry-run") return "dry-run";
  if (argv.length === 1 && argv[0] === "--execute") return "execute";
  return null;
}

function toPositiveNumber(value, label, network, errors) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) {
    errors.push(`[${network}] ${label} must be a positive number (got: ${JSON.stringify(value)})`);
    return null;
  }
  return n;
}

function validateEntry(network, entry, { requireLocker }) {
  const errors = [];
  if (entry == null || typeof entry !== "object") {
    return [`[${network}] config entry must be an object`];
  }
  const token = typeof entry.tokenAddress === "string" ? entry.tokenAddress.trim() : "";
  if (token === "") {
    errors.push(
      `[${network}] tokenAddress not set — EVOLVE is not deployed on this network yet ` +
        `(EVOLVE exists only on Sepolia). Populate "tokenAddress" in liquidity-setup.json ` +
        `with the deployed ERC-20 address (0x + 40 hex chars).`,
    );
  } else if (!ADDRESS_RE.test(token)) {
    errors.push(`[${network}] tokenAddress invalid: "${token}" — expected 0x + 40 hex chars.`);
  }
  if (!Object.hasOwn(DEX_ROUTERS, String(entry.dex))) {
    errors.push(
      `[${network}] unsupported dex: ${JSON.stringify(entry.dex)} (supported: ${Object.keys(DEX_ROUTERS).join(", ")})`,
    );
  }
  toPositiveNumber(entry.amountEVOLVE, "amountEVOLVE", network, errors);
  toPositiveNumber(entry.amountNative, "amountNative", network, errors);
  toPositiveNumber(entry.feeTier, "feeTier", network, errors);
  if (requireLocker) {
    const locker = typeof entry.lockerAddress === "string" ? entry.lockerAddress.trim() : "";
    if (locker === "") {
      errors.push(
        `[${network}] lockerAddress not set — LiquidityLocker is not deployed on this network. ` +
          `Deploy LiquidityLocker first, then set "lockerAddress" in liquidity-setup.json.`,
      );
    } else if (!ADDRESS_RE.test(locker)) {
      errors.push(`[${network}] lockerAddress invalid: "${locker}" — expected 0x + 40 hex chars.`);
    }
  }
  return errors;
}

function printNetworkPlan(network, entry) {
  const dex = DEX_ROUTERS[entry.dex];
  const router =
    (typeof entry.routerAddress === "string" && entry.routerAddress.trim()) || dex.defaultAddress;
  const weth =
    (typeof entry.wethAddress === "string" && entry.wethAddress.trim()) || WETH_BY_NETWORK[network];
  const locker = (typeof entry.lockerAddress === "string" && entry.lockerAddress.trim()) || "";
  const unlockTime = entry.unlockTime;
  console.log(`\n[${network}] plan:`);
  console.log(`  dex:             ${entry.dex} (${dex.label})`);
  console.log(`  EVOLVE token:    ${entry.tokenAddress}`);
  console.log(`  EVOLVE amount:   ${entry.amountEVOLVE} EVOLVE`);
  console.log(`  native amount:   ${entry.amountNative} ${entry.nativeToken}`);
  console.log(`  fee tier:        ${entry.feeTier}%`);
  console.log(`  router:          ${router}`);
  console.log(`  wrapped native:  ${weth}`);
  console.log(
    `  LiquidityLocker: ${locker || '(not configured — set "lockerAddress" in liquidity-setup.json)'}`,
  );
  console.log(
    `  unlock time:     ${unlockTime ?? "(not configured)"}${unlockTime ? ` (${new Date(unlockTime * 1000).toISOString()})` : ""}`,
  );
  console.log(
    `  steps:           approve → add liquidity → approve LP → LiquidityLocker.lock(lpToken, amount)`,
  );
}

function main() {
  const mode = parseArgs(process.argv.slice(2));
  if (mode === null) {
    console.error(`Error: unknown arguments: ${process.argv.slice(2).join(" ")}\n\n${USAGE}`);
    process.exit(1);
  }

  let config;
  try {
    config = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
  } catch (e) {
    console.error(`Cannot read config ${CONFIG_PATH}: ${e.message}`);
    process.exit(1);
  }

  const requireLocker = mode === "execute";
  const networks = Object.keys(config);
  const errorsByNetwork = new Map(
    networks.map((n) => [n, validateEntry(n, config[n], { requireLocker })]),
  );
  const validNetworks = networks.filter((n) => errorsByNetwork.get(n).length === 0);

  console.log(
    `=== EVOLVE liquidity provisioning — ${mode === "execute" ? "EXECUTE" : "DRY RUN (default)"} ===`,
  );
  console.log(`Config: ${CONFIG_PATH}`);

  for (const network of networks) {
    const errors = errorsByNetwork.get(network);
    if (errors.length > 0) {
      console.log(`\n[${network}] REFUSED:`);
      for (const msg of errors) console.log(`  ✗ ${msg}`);
    } else {
      printNetworkPlan(network, config[network]);
    }
  }

  if (mode === "dry-run") {
    console.log(`\nDRY RUN — no transactions sent.`);
    if (validNetworks.length === 0) {
      console.log(
        `Refused: 0/${networks.length} networks provisionable — fix liquidity-setup.json.`,
      );
      process.exit(1);
    }
    console.log(
      `${validNetworks.length}/${networks.length} networks provisionable. Re-run with --execute to broadcast.`,
    );
    return;
  }

  // mode === "execute" — fail-closed: any validation error blocks ALL broadcasting.
  if (validNetworks.length < networks.length) {
    console.error(
      `\nREFUSING to broadcast (fail-closed): ${networks.length - validNetworks.length}/${networks.length} ` +
        `network(s) failed validation. No env vars were read, no chain connection was made, no transaction was sent.`,
    );
    process.exit(1);
  }
  console.log(`\n--execute received: broadcasting ENABLED for ${networks.length} network(s).`);
  runExecute(config, networks).catch((e) => {
    console.error("\nExecution failed:", e?.shortMessage || e?.message || e);
    process.exit(1);
  });
}

async function runExecute(config, networks) {
  // Chain access starts HERE (never at module top-level): dotenv + ethers dynamically.
  await import("dotenv/config");
  const { ethers } = await import("ethers");

  if (!process.env.PRIVATE_KEY) {
    console.error("Missing PRIVATE_KEY env var (repo convention, see script/deploy-sepolia.mjs).");
    process.exit(1);
  }
  // Pre-flight ALL RPC env vars before touching any chain (fail-closed).
  for (const network of networks) {
    const rpcEnv = RPC_ENV_BY_NETWORK[network] ?? `${network.toUpperCase()}_RPC_URL`;
    if (!process.env[rpcEnv]) {
      console.error(`Missing ${rpcEnv} env var for network "${network}".`);
      process.exit(1);
    }
  }

  for (const network of networks) {
    const rpcEnv = RPC_ENV_BY_NETWORK[network] ?? `${network.toUpperCase()}_RPC_URL`;
    const provider = new ethers.JsonRpcProvider(process.env[rpcEnv]);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const entry = config[network];
    const balance = await provider.getBalance(wallet.address);
    console.log(
      `\n[${network}] signer ${wallet.address} — balance ${ethers.formatEther(balance)} ${entry.nativeToken}`,
    );
    if (balance === 0n) {
      console.error(`[${network}] signer has zero native balance — aborting before approvals.`);
      process.exit(1);
    }

    const routerAddress =
      (typeof entry.routerAddress === "string" && entry.routerAddress.trim()) ||
      DEX_ROUTERS[entry.dex].defaultAddress;
    const wethAddress =
      (typeof entry.wethAddress === "string" && entry.wethAddress.trim()) ||
      WETH_BY_NETWORK[network];
    const amountEVOLVE = ethers.parseEther(String(entry.amountEVOLVE));
    const amountNative = ethers.parseEther(String(entry.amountNative));
    const ctx = {
      ethers,
      network,
      entry,
      wallet,
      routerAddress,
      wethAddress,
      amountEVOLVE,
      amountNative,
      evolve: new ethers.Contract(entry.tokenAddress, ERC20_ABI, wallet),
    };

    // 1) Provision liquidity via the DEX router → { lpToken, lpAmount }.
    const { lpToken, lpAmount } =
      entry.dex === "uniswap-v3" ? await provisionUniswapV3(ctx) : await provisionTraderJoe(ctx);

    // 2) Lock the received LP tokens: approve locker, then LiquidityLocker.lock (pull-based).
    const locker = new ethers.Contract(entry.lockerAddress, LOCKER_ABI, wallet);
    const lp = new ethers.Contract(lpToken, ERC20_ABI, wallet);
    console.log(
      `[${network}] approving LP ${lpToken} to LiquidityLocker ${entry.lockerAddress}...`,
    );
    (await lp.approve(entry.lockerAddress, lpAmount)).wait();
    console.log(`[${network}] LiquidityLocker.lock(${lpToken}, ${lpAmount})...`);
    (await locker.lock(lpToken, lpAmount)).wait();
    console.log(`[${network}] done — LP locked.`);
  }
  console.log(`\n=== LIQUIDITY PROVISIONING COMPLETE ===`);
}

async function provisionUniswapV3(ctx) {
  const {
    ethers,
    network,
    entry,
    wallet,
    routerAddress,
    wethAddress,
    amountEVOLVE,
    amountNative,
    evolve,
  } = ctx;
  const fee = Math.round(Number(entry.feeTier) * 10000);
  if (!Number.isInteger(fee) || fee <= 0)
    throw new Error(`[${network}] invalid feeTier ${entry.feeTier}`);
  const weth = new ethers.Contract(wethAddress, WETH_ABI, wallet);
  const pm = new ethers.Contract(routerAddress, POSITION_MANAGER_ABI, wallet);

  console.log(`[${network}] wrapping ${entry.amountNative} ${entry.nativeToken} -> WETH...`);
  (await weth.deposit({ value: amountNative })).wait();
  console.log(`[${network}] approving EVOLVE + WETH to position manager...`);
  (await evolve.approve(routerAddress, amountEVOLVE)).wait();
  (await weth.approve(routerAddress, amountNative)).wait();

  const [tokenA, tokenB] = [entry.tokenAddress, wethAddress].sort(); // V3 requires sorted order
  const params = {
    tokenA,
    tokenB,
    fee,
    tickLower: -MAX_TICK,
    tickUpper: MAX_TICK,
    amount0Desired: tokenA === entry.tokenAddress ? amountEVOLVE : amountNative,
    amount1Desired: tokenA === entry.tokenAddress ? amountNative : amountEVOLVE,
    amount0Min:
      ((tokenA === entry.tokenAddress ? amountEVOLVE : amountNative) * (10000n - SLIPPAGE_BPS)) /
      10000n,
    amount1Min:
      ((tokenA === entry.tokenAddress ? amountNative : amountEVOLVE) * (10000n - SLIPPAGE_BPS)) /
      10000n,
    recipient: wallet.address,
    deadline: Math.floor(Date.now() / 1000) + 20 * 60,
  };
  console.log(`[${network}] minting full-range V3 position (fee ${fee})...`);
  const tx = await pm.mint(params);
  const receipt = await tx.wait();
  const tokenId = receipt.logs[0].args.tokenId ?? receipt.logs[0].args[0]; // Mint event increasesTokenId
  console.log(`[${network}] position minted — tokenId ${tokenId}`);
  // NOTE: a V3 position is an ERC721 on the position manager. LiquidityLocker.lock
  // uses IERC20.safeTransferFrom whose selector (0x23b872dd) matches ERC721.transferFrom,
  // so `amount` here is the position tokenId.
  return { lpToken: routerAddress, lpAmount: tokenId };
}

async function provisionTraderJoe(ctx) {
  const {
    ethers,
    network,
    entry,
    wallet,
    routerAddress,
    wethAddress,
    amountEVOLVE,
    amountNative,
    evolve,
  } = ctx;
  const router = new ethers.Contract(routerAddress, JOE_ROUTER_ABI, wallet);
  console.log(`[${network}] approving EVOLVE to router...`);
  (await evolve.approve(routerAddress, amountEVOLVE)).wait();
  console.log(
    `[${network}] addLiquidityAVAX(${entry.amountEVOLVE} EVOLVE, ${entry.amountNative} ${entry.nativeToken})...`,
  );
  const deadline = Math.floor(Date.now() / 1000) + 20 * 60;
  (
    await router.addLiquidityAVAX(
      entry.tokenAddress,
      amountEVOLVE,
      (amountEVOLVE * (10000n - SLIPPAGE_BPS)) / 10000n,
      (amountNative * (10000n - SLIPPAGE_BPS)) / 10000n,
      wallet.address,
      deadline,
      { value: amountNative },
    )
  ).wait();
  const factory = new ethers.Contract(JOE_FACTORY, JOE_FACTORY_ABI, wallet);
  const pair = await factory.getPair(entry.tokenAddress, wethAddress);
  if (!ADDRESS_RE.test(pair) || pair === ethers.ZeroAddress) {
    throw new Error(`[${network}] Joe pair not found for EVOLVE/${wethAddress}`);
  }
  const lpAmount = await new ethers.Contract(pair, ERC20_ABI, wallet).balanceOf(wallet.address);
  console.log(`[${network}] received ${lpAmount} LP tokens (${pair})`);
  return { lpToken: pair, lpAmount };
}

main();
