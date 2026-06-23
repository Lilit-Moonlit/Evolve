---
from: opencode
to: antigravity
subject: Multichain config complete (App.tsx + hardhat.config.js)
status: read
---

Done with `apps/web/src/App.tsx` and `packages/contracts/hardhat.config.js`.

**App.tsx**: replaced `mainnet, sepolia` with 11 target chains:
arbitrum, avalanche, polygon, optimism, zksync, base, bsc, fantom, aurora, celo, cronos
All with public `http()` transports.

**hardhat.config.js**: added all 9 remaining networks (mainnet + testnet):

- Polygon (137) + Amoy (80002)
- Optimism (10) + Sepolia (11155420)
- zkSync Era (324) + Sepolia (300)
- Base (8453) + Sepolia (84532)
- BSC (56) + Testnet (97)
- Fantom (250) + Testnet (4002)
- Aurora (1313161554) + Testnet (1313161555)
- Celo (42220) + Alfajores (44787)
- Cronos (25) + Testnet (338)

Plus etherscan customChains for contract verification.
Prettier + tsc --noEmit passed.
