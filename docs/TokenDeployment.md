# EVOLVE Token Deployment Guide

This guide covers deploying the EVOLVE token to multiple networks, including verification and liquidity setup.

## Supported Networks

The EVOLVE token is designed to be deployed across 11 networks:

| Network           | Chain ID   | Public RPC URL                        | Explorer                        | Native Token |
| ----------------- | ---------- | ------------------------------------- | ------------------------------- | ------------ |
| Ethereum Mainnet  | 1          | https://eth.llamarpc.com              | https://etherscan.io            | ETH          |
| Arbitrum One      | 42161      | https://arb1.arbitrum.io/rpc          | https://arbiscan.io             | ETH          |
| Avalanche C-Chain | 43114      | https://api.avax.network/ext/bc/C/rpc | https://snowtrace.io            | AVAX         |
| Polygon PoS       | 137        | https://polygon.llamarpc.com          | https://polygonscan.com         | MATIC        |
| Optimism          | 10         | https://mainnet.optimism.io           | https://optimistic.etherscan.io | ETH          |
| Base              | 8453       | https://mainnet.base.org              | https://basescan.org            | ETH          |
| BNB Smart Chain   | 56         | https://bsc-dataseed.binance.org      | https://bscscan.com             | BNB          |
| Fantom Opera      | 250        | https://rpc.ftm.tools                 | https://ftmscan.com             | FTM          |
| Aurora            | 1313161554 | https://mainnet.aurora.dev            | https://aurorascan.dev          | ETH          |
| Moonbeam          | 1284       | https://rpc.api.moonbeam.network      | https://moonscan.io             | GLMR         |
| Celo              | 42220      | https://forno.celo.org                | https://celoscan.io             | CELO         |

## Prerequisites

- Node.js 20+
- Private keys for target networks
- RPC URLs for target networks
- API keys for respective explorers

## Environment Configuration

### Public RPC (Default)

The deployment scripts use public RPC URLs by default. These are free but may have rate limits and lower reliability.

### Private RPC (Recommended for Production)

For production deployments, replace public RPC URLs with private RPC providers like Alchemy or Infura for better reliability and performance.

#### Using Alchemy

1. Create an account at [alchemy.com](https://alchemy.com)
2. Create a new app for each network
3. Copy the RPC URL
4. Update your `.env` file:

```bash
# Example for Arbitrum
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Example for Avalanche
AVALANCHE_RPC_URL=https://avalanche-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
```

#### Using Infura

1. Create an account at [infura.io](https://infura.io)
2. Create a new project
3. Enable the networks you need
4. Copy the RPC URL
5. Update your `.env` file:

```bash
# Example for Arbitrum
ARBITRUM_RPC_URL=https://arbitrum-mainnet.infura.io/v3/YOUR_INFURA_KEY

# Example for Avalanche
AVALANCHE_RPC_URL=https://avalanche-c-chain.infura.io/v3/YOUR_INFURA_KEY
```

#### Environment Variables Reference

Create a `.env` file in the `packages/contracts` directory:

```bash
# Ethereum
ETHEREUM_RPC_URL=your_ethereum_rpc_url
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key

# Arbitrum
ARBITRUM_RPC_URL=your_arbitrum_rpc_url
ARBISCAN_API_KEY=your_arbiscan_api_key

# Avalanche
AVALANCHE_RPC_URL=your_avalanche_rpc_url
AVAX_PRIVATE_KEY=your_avax_private_key
SNOWTRACE_API_KEY=your_snowtrace_api_key

# Polygon
POLYGON_RPC_URL=your_polygon_rpc_url
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Optimism
OPTIMISM_RPC_URL=your_optimism_rpc_url
OPTIMISM_API_KEY=your_optimism_api_key

# Base
BASE_RPC_URL=your_base_rpc_url
BASESCAN_API_KEY=your_basescan_api_key

# BSC
BSC_RPC_URL=your_bsc_rpc_url
BSCSCAN_API_KEY=your_bscscan_api_key

# Fantom
FANTOM_RPC_URL=your_fantom_rpc_url
FTMSCAN_API_KEY=your_ftmscan_api_key

# Aurora
AURORA_RPC_URL=your_aurora_rpc_url
AURORASCAN_API_KEY=your_aurorascan_api_key

# Moonbeam
MOONBEAM_RPC_URL=your_moonbeam_rpc_url
MOONSCAN_API_KEY=your_moonscan_api_key

# Celo
CELO_RPC_URL=your_celo_rpc_url
CELOSCAN_API_KEY=your_celoscan_api_key
```

## Deployment Steps

### Single Network Deployment

Deploy to a specific network:

```bash
cd packages/contracts
npx hardhat compile
npx hardhat run script/deploy-all.ts --network <network-name>
```

Example for Arbitrum:

```bash
npx hardhat run script/deploy-all.ts --network arbitrum
```

### Multi-Network Deployment

Deploy to all networks at once:

```bash
npx hardhat run script/deploy-all.ts all
```

### Deployment Artifacts

The deployment script outputs:

- Contract addresses for EVOLVE and ProfileNFT
- Network information
- Deployer address
- Timestamp

Save this information for verification and liquidity setup.

## Verification

### Verify on Explorer

After deployment, verify contracts on respective explorers:

```bash
export CONTRACT_ADDRESS="deployed_contract_address"
export DEPLOYER_ADDRESS="deployer_wallet_address"
npx hardhat run script/verify.ts --network <network-name>
```

### Verification Links

- **Ethereum**: https://etherscan.io/address/{CONTRACT_ADDRESS}
- **Arbitrum**: https://arbiscan.io/address/{CONTRACT_ADDRESS}
- **Avalanche**: https://snowtrace.io/address/{CONTRACT_ADDRESS}
- **Polygon**: https://polygonscan.com/address/{CONTRACT_ADDRESS}
- **Optimism**: https://optimistic.etherscan.io/address/{CONTRACT_ADDRESS}
- **Base**: https://basescan.org/address/{CONTRACT_ADDRESS}
- **BSC**: https://bscscan.com/address/{CONTRACT_ADDRESS}
- **Fantom**: https://ftmscan.io/address/{CONTRACT_ADDRESS}
- **Aurora**: https://aurorascan.dev/address/{CONTRACT_ADDRESS}
- **Moonbeam**: https://moonscan.io/address/{CONTRACT_ADDRESS}
- **Celo**: https://celoscan.io/address/{CONTRACT_ADDRESS}

## Liquidity Setup

### Uniswap V3 (Ethereum, Arbitrum, Optimism, Base)

1. Visit [Uniswap V3 Pool](https://app.uniswap.org/pools)
2. Select target network
3. Add EVOLVE token address
4. Add native token (ETH)
5. Set fee tier to 0.3%
6. Add liquidity (from the 1.2B Liquidity & partnerships allocation)

### Trader Joe (Avalanche)

1. Visit [Trader Joe Liquidity](https://traderjoexyz.com/avalanche/pool)
2. Add EVOLVE token address
3. Add AVAX
4. Set fee tier to 0.3%
5. Add liquidity (from the 1.2B Liquidity & partnerships allocation)

### QuickSwap (Polygon)

1. Visit [QuickSwap](https://quickswap.exchange)
2. Add EVOLVE token address
3. Add MATIC
4. Add liquidity (from the 1.2B Liquidity & partnerships allocation)

### PancakeSwap (BSC)

1. Visit [PancakeSwap](https://pancakeswap.finance)
2. Add EVOLVE token address
3. Add BNB
4. Add liquidity (from the 1.2B Liquidity & partnerships allocation)

## GitHub Actions Deployment

The deployment is automated via GitHub Actions. Configure the following secrets:

**Required for all networks:**

- `PRIVATE_KEY` (or network-specific keys)
- `DEPLOYER_ADDRESS`

**Network-specific:**

- `ETHEREUM_RPC_URL`, `ETHERSCAN_API_KEY`
- `ARBITRUM_RPC_URL`, `ARBISCAN_API_KEY`
- `AVALANCHE_RPC_URL`, `AVAX_PRIVATE_KEY`, `SNOWTRACE_API_KEY`
- `POLYGON_RPC_URL`, `POLYGONSCAN_API_KEY`
- `OPTIMISM_RPC_URL`, `OPTIMISM_API_KEY`
- `BASE_RPC_URL`, `BASESCAN_API_KEY`
- `BSC_RPC_URL`, `BSCSCAN_API_KEY`
- `FANTOM_RPC_URL`, `FTMSCAN_API_KEY`
- `AURORA_RPC_URL`, `AURORASCAN_API_KEY`
- `MOONBEAM_RPC_URL`, `MOONSCAN_API_KEY`
- `CELO_RPC_URL`, `CELOSCAN_API_KEY`

Trigger the workflow manually or push to main branch.

## Token Details

- **Name**: EVOLVE
- **Symbol**: EVOLVE
- **Decimals**: 18
- **Max Supply**: 8,000,000,000 EVOLVE
- **Features**: Burnable, Access Control, TimelockController (48h) admin

## Contracts

### EVOLVE.sol

ERC-20 token with:

- Minting controls via MINTER_ROLE
- Burnable functionality
- Monotonic totalMinted issuance capped at 8B (MINTER_ROLE = timelock + RewardMinter)
- Access control for admin functions

### ProfileNFT.sol

ERC-721 NFT for:

- User profile representation
- Soulbound (non-transferable)
- Metadata URI management

## Troubleshooting

### Deployment Fails

- Check RPC URL is correct and accessible
- Verify private key has sufficient funds for gas
- Ensure network is not congested
- Try with private RPC if public RPC is rate-limited

### Verification Fails

- Wait for block confirmations (usually 5-10 blocks)
- Check API key is valid
- Verify constructor arguments match deployment
- Ensure contract is deployed to correct network

### Liquidity Setup Fails

- Ensure token is verified on explorer
- Check token has sufficient balance
- Verify token transfer is enabled
- Confirm DEX supports the network

### RPC Issues

- If public RPC is slow or unreliable, switch to Alchemy/Infura
- Check RPC endpoint status
- Verify network connectivity
- Consider using multiple RPC endpoints for redundancy

## Security Considerations

- Never commit private keys to repository
- Use hardware wallets for mainnet deployments
- Test on testnets first
- Revoke permissions after deployment
- Monitor contract activity post-deployment
- Use private RPC providers for production
- Implement proper access controls
- Regular security audits

## Monitoring

After deployment, monitor:

- Contract balance and transactions
- Token transfers and minting
- Access control changes
- Gas usage patterns
- Network-specific activity

Use explorer alerts or monitoring services like Tenderly for real-time notifications.
