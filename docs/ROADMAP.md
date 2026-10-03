# EVOLVE: Project Roadmap

This roadmap outlines the development phases and current status of the EVOLVE project. We are committed to transparency and building a robust, decentralized platform.

## Current Status

EVOLVE is currently in an **alpha development phase**. All smart contracts are deployed on the **Sepolia testnet only** and are for testing purposes. The platform is not yet ready for production use, and features are subject to ongoing development and refinement.

## Completed Milestones

The following key features and infrastructure components have been successfully implemented:

- **Core Smart Contracts**: EvolveFund.sol, BondManager.sol, EVOLVE (ERC-20), ProfileNFT (ERC-721), DNAVerification, VerificationRegistry, TrustScore, Voting, Evolve2Earn, Governance, TimelockController.
- **Tokenomics & Governance**: Initial tokenomics model (8B supply, 1% founder/devs, 90% treasury, 8% reserve), emoji gift economy, and governance vote weighting.
- **Authentication & Recovery**: SIWE (Sign-In with Ethereum) and on-chain DNA Account Recovery (SHA-256 commitment).
- **Health Verification**: STD compatibility system (anonymous verdicts), PDF lab report extraction (OCR fallback), and laboratory partner flow (QR, face match, report upload).
- **User Experience**: Onboarding Wizard (photo blur, age, languages, bio), Profile Kind selection ("Who are you"), Gender and "Looking For" filters, UI reorganization (settings in profile, communications panel), cascading country/city selects, and smart `canTravel` filter.
- **Decentralization & Resilience**: P2P-first messaging (libp2p/Nostr), multi-network infrastructure (Arbitrum, Avalanche), and Safety Mode (public facade) for ban-resistance.
- **Account Abstraction**: ERC-4337 integration for gasless transactions and smart wallets.
- **DEX Integration**: Pure 1inch client library, server proxy, DexSwap UI, and LiquidityLocker provisioning script.
- **Proposals Sync**: Multi-platform proposals synchronization (GitHub, Codeberg, GitLab) for in-app governance.

## In Progress Milestones

- **Full Production Build**: Ongoing efforts to prepare the entire application for a production-ready release.

## Planned Milestones

These are features and improvements we intend to implement in future phases:

- **Final QA**: Comprehensive quality assurance audit across all features.
- **Real Mail Provider Adapter**: Integration with actual email services (e.g., IMAP/Gmail/Mailgun) for automated lab report ingestion.
- **On-chain Lab Registry & Test Certification**: Development of smart contracts (`LabRegistry.sol`, `TestCertification.sol`) for on-chain registration of labs and certification of test results.
- **Enhanced Email Verification**: Implementation of email verification and HMAC signing for source emails in lab reports to enhance trust.
- **On-chain Verified Result Attestations**: Displaying certified health attestations directly on user profiles from on-chain records.
- **Token Vesting Wallet Update**: Updating `VestingWalletCliff.sol` to reflect the new Founder and Developer token allocations.
- **Liquidity Locker Funding**: Funding the `LiquidityLocker` from the Community treasury sub-bucket to provide DEX liquidity.
- **Trustless RewardVault & Governance-Gated Emission** (_planned — do not rush_): Lock the un-circulated reserve in a non-drainable `RewardVault` (no admin withdraw; releases only via rate-capped reward flows) with `Governance` as the sole timelock proposer, so no admin — including the founder — can dump the reserve. Full design and migration plan: [`docs/REWARD-VAULT-PLAN.md`](REWARD-VAULT-PLAN.md). Prerequisite: bug-free contracts + full end-to-end app testing first.

## Blocked Milestones

- **DEX Liquidity Provisioning on Arbitrum/Avalanche**: This milestone is currently **blocked**. It requires the EVOLVE token to be deployed on Arbitrum and Avalanche, and a 1inch API key to be configured. These prerequisites are pending separate deployments and configurations.
