# EVOLVE: Frequently Asked Questions (FAQ)

## General

### What is EVOLVE?

EVOLVE is a decentralized, privacy-focused open-source project building a platform for dating, conception, and health verification. It prioritizes user control, anonymous health data, and resilience against censorship.

### Is EVOLVE launched?

EVOLVE is currently in an **alpha development phase**. The smart contracts are deployed on the **Sepolia testnet only**. It is not yet ready for production use, and features are subject to change.

### Is the app free to use?

Core features of the EVOLVE platform are designed to be free. Some advanced features or specific interactions within the ecosystem may involve the EVOLVE token.

### What devices can I use EVOLVE on?

EVOLVE is accessible via web browsers (desktop and mobile) and is being developed for mobile devices using Expo/React Native.

### How can I contribute to the EVOLVE project?

EVOLVE is an open-source project. Contributions are welcome through our GitHub repository, whether through code, bug reports, feature suggestions, or proposals.

## Privacy & Security

### Is my health data private?

**Yes, absolutely.** EVOLVE is built with privacy-by-design principles. Individual STD (Sexually Transmitted Disease) and DNA statuses are **never** revealed to other users or third parties. The system only provides anonymous compatibility verdicts (Safe, Compatible, Caution, Risk) based on verified health data.

### Do I need a phone number or email address to use EVOLVE?

**No.** EVOLVE prioritizes self-custodial authentication. You can log in using your cryptocurrency wallet (Sign-In with Ethereum - SIWE). Account recovery is also possible through on-chain DNA verification, eliminating the need for traditional phone or email dependencies.

## EVOLVE Token

### Is there an EVOLVE token?

Yes, EVOLVE is an ERC-20 token. It plays a crucial role in the platform's governance, staking mechanisms (for men in certain modes), and the emoji gift economy.

### Can I buy EVOLVE tokens?

**No, there is no public sale of EVOLVE tokens.** Tokens are primarily earned through active participation in the platform, such as through the emoji gift economy or as verification rewards for STD/DNA test confirmations. Donations are accepted as gifts, but they do not constitute a purchase of tokens or an investment.

## Technology

### What blockchain networks does EVOLVE support?

EVOLVE is designed for a multi-network future (the app is configured for 18 EVM networks). **Smart contracts are currently deployed only on Ethereum Sepolia (a testnet)** — Arbitrum and Avalanche are planned primary networks, but EVOLVE is **not yet deployed there** and there is no live liquidity. The project aims to expand across many EVM-compatible networks to maximize reach and resilience.

### What is DNA Account Recovery?

DNA Account Recovery allows users to regain access to their EVOLVE account using an on-chain DNA verification record. This method enhances security and removes reliance on centralized recovery mechanisms. Your DNA test result is converted into a secure SHA-256 hash and committed to the blockchain, which is then used for verification.

### How does STD compatibility work without revealing my status?

When you upload your STD test results, EVOLVE's parser extracts relevant pathogen information. When you view another user's profile, the system compares your parsed results with theirs to generate an anonymous compatibility verdict (Safe, Compatible, Caution, Risk). Your individual positive or negative status for any specific pathogen is never shared.
