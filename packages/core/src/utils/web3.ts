// @ts-nocheck — browser-specific code, Eip1193Provider event API not in types

/**
 * Web3 utilities for Evolve
 * Provides wallet connection and transaction helpers
 */

/**
 * Check if wallet is available in browser
 */
export function isWalletAvailable(): boolean {
  return (
    typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  );
}

/**
 * Get wallet provider
 */
export function getWalletProvider() {
  if (!isWalletAvailable()) {
    throw new Error("Wallet not available");
  }
  return window.ethereum;
}

/**
 * Connect wallet
 */
export async function connectWallet(): Promise<string> {
  const provider = getWalletProvider();
  const accounts = await provider.request({ method: "eth_requestAccounts" });
  return accounts[0];
}

/**
 * Get current wallet address
 */
export async function getWalletAddress(): Promise<string> {
  const provider = getWalletProvider();
  const accounts = await provider.request({ method: "eth_accounts" });
  return accounts[0] || "";
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(address: string): Promise<string> {
  const provider = getWalletProvider();
  const balance = await provider.request({
    method: "eth_getBalance",
    params: [address, "latest"],
  });
  return balance;
}

/**
 * Get chain ID
 */
export async function getChainId(): Promise<number> {
  const provider = getWalletProvider();
  const chainId = await provider.request({ method: "eth_chainId" });
  return parseInt(chainId, 16);
}

/**
 * Switch chain
 */
export async function switchChain(chainId: number): Promise<void> {
  const provider = getWalletProvider();
  await provider.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `0x${chainId.toString(16)}` }],
  });
}

/**
 * Add chain to wallet
 */
export async function addChain(chainConfig: {
  chainId: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
}): Promise<void> {
  const provider = getWalletProvider();
  await provider.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: `0x${chainConfig.chainId.toString(16)}`,
        chainName: chainConfig.chainName,
        nativeCurrency: chainConfig.nativeCurrency,
        rpcUrls: chainConfig.rpcUrls,
        blockExplorerUrls: chainConfig.blockExplorerUrls,
      },
    ],
  });
}

/**
 * Sign message
 */
export async function signMessage(message: string): Promise<string> {
  const provider = getWalletProvider();
  const address = await getWalletAddress();
  const signature = await provider.request({
    method: "personal_sign",
    params: [message, address],
  });
  return signature;
}

/**
 * Sign typed data (EIP-712)
 */
export async function signTypedData(
  domain: Record<string, unknown>,
  types: Record<string, unknown>,
  value: Record<string, unknown>,
): Promise<string> {
  const provider = getWalletProvider();
  const address = await getWalletAddress();
  const signature = await provider.request({
    method: "eth_signTypedData_v4",
    params: [address, JSON.stringify({ domain, types, value })],
  });
  return signature;
}

/**
 * Send transaction
 */
export async function sendTransaction(transaction: {
  to: string;
  value?: string;
  data?: string;
  gas?: string;
}): Promise<string> {
  const provider = getWalletProvider();
  const from = await getWalletAddress();
  const txHash = await provider.request({
    method: "eth_sendTransaction",
    params: [{ from, ...transaction }],
  });
  return txHash;
}

/**
 * Estimate gas for transaction
 */
export async function estimateGas(transaction: {
  to: string;
  value?: string;
  data?: string;
}): Promise<string> {
  const provider = getWalletProvider();
  const from = await getWalletAddress();
  const gas = await provider.request({
    method: "eth_estimateGas",
    params: [{ from, ...transaction }],
  });
  return gas;
}

/**
 * Get transaction receipt
 */
export async function getTransactionReceipt(
  txHash: string,
): Promise<Record<string, unknown>> {
  const provider = getWalletProvider();
  const receipt = await provider.request({
    method: "eth_getTransactionReceipt",
    params: [txHash],
  });
  return receipt;
}

/**
 * Wait for transaction to be mined
 */
export async function waitForTransaction(
  txHash: string,
  confirmations: number = 1,
): Promise<Record<string, unknown>> {
  const provider = getWalletProvider();
  let receipt = await getTransactionReceipt(txHash);
  let attempts = 0;
  const maxAttempts = 100;

  while (!receipt && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    receipt = await getTransactionReceipt(txHash);
    attempts++;
  }

  if (!receipt) {
    throw new Error("Transaction not found");
  }

  // Wait for confirmations
  const currentBlock = await provider.request({ method: "eth_blockNumber" });
  const receiptBlock = parseInt(receipt.blockNumber, 16);
  const currentBlockNumber = parseInt(currentBlock, 16);

  while (
    currentBlockNumber - receiptBlock < confirmations &&
    attempts < maxAttempts
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    attempts++;
  }

  return receipt;
}

/**
 * Format address (shorten)
 */
export function formatAddress(address: string, length: number = 4): string {
  if (!address) return "";
  return `${address.slice(0, 2 + length)}...${address.slice(-length)}`;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Convert Wei to Ether
 */
export function weiToEther(wei: string): string {
  const value = BigInt(wei);
  const ether = Number(value) / 10 ** 18;
  return ether.toString();
}

/**
 * Convert Ether to Wei
 */
export function etherToWei(ether: string): string {
  const value = parseFloat(ether);
  const wei = BigInt(Math.floor(value * 10 ** 18));
  return wei.toString();
}

/**
 * Format Ether value
 */
export function formatEther(value: string, decimals: number = 4): string {
  const ether = weiToEther(value);
  return parseFloat(ether).toFixed(decimals);
}

/**
 * Listen to account changes
 */
export function onAccountChange(callback: (accounts: string[]) => void): void {
  if (!isWalletAvailable()) return;
  window.ethereum.on("accountsChanged", callback);
}

/**
 * Listen to chain changes
 */
export function onChainChange(callback: (chainId: string) => void): void {
  if (!isWalletAvailable()) return;
  window.ethereum.on("chainChanged", callback);
}

/**
 * Remove event listeners
 */
export function removeListeners(): void {
  if (!isWalletAvailable()) return;
  window.ethereum.removeAllListeners();
}

/**
 * Check if wallet is connected
 */
export async function isWalletConnected(): Promise<boolean> {
  const address = await getWalletAddress();
  return address !== "";
}

/**
 * Disconnect wallet (clear local state)
 */
export function disconnectWallet(): void {
  // Note: Most wallets don't have a disconnect method
  // This is mainly for clearing local state
  removeListeners();
}
