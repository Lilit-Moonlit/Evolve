import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, useChainId, useSendTransaction, useSwitchChain } from "wagmi";
import {
  SUPPORTED_DEX_CHAINS,
  isEvmAddress,
  isNonNegativeIntegerString,
  isSupportedChain,
  isSwapAvailable,
  isValidSlippage,
  parseQuoteResponse,
  parseSwapResponse,
  type QuoteView,
  type SupportedDexChain,
} from "../lib/dex-integration";
import { networks } from "../lib/networks";

type BusyTask = "quote" | "swap" | null;

type ErrorKey = "dex.quoteError" | "dex.swapFailed" | "dex.proxyNotConfigured";

function isHexData(value: string): value is `0x${string}` {
  return value.startsWith("0x");
}

interface ProxyResponse {
  status: number;
  ok: boolean;
  json: () => Promise<unknown>;
}

export default function DexSwap() {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const walletChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const {
    sendTransaction,
    isPending: isTxPending,
    isError: isTxError,
    isSuccess: isTxSuccess,
  } = useSendTransaction();

  const [chainId, setChainId] = useState<SupportedDexChain>(() =>
    isSupportedChain(walletChainId) ? walletChainId : SUPPORTED_DEX_CHAINS[0],
  );
  const [src, setSrc] = useState("");
  const [dst, setDst] = useState("");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("1");
  const [quote, setQuote] = useState<QuoteView | null>(null);
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null);
  const [busy, setBusy] = useState<BusyTask>(null);

  const connected = isConnected && address !== undefined;
  const swapAvailable = isSwapAvailable(chainId);
  const srcValid = isEvmAddress(src);
  const dstValid = isEvmAddress(dst);
  const amountValid = isNonNegativeIntegerString(amount);
  const parsedSlippage = slippage.trim() === "" ? undefined : Number(slippage);
  const slippageValid = parsedSlippage === undefined || isValidSlippage(parsedSlippage);
  const wrongChain = connected && walletChainId !== chainId;
  const formValid = srcValid && dstValid && amountValid && slippageValid;
  const canQuote = connected && formValid && busy === null;
  const canSwap = canQuote && swapAvailable && quote !== null && !wrongChain;

  function selectChain(next: SupportedDexChain): void {
    setChainId(next);
    if (isConnected && walletChainId !== next) {
      switchChain({ chainId: next });
    }
  }

  async function postProxy(url: string): Promise<ProxyResponse> {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chainId,
        src,
        dst,
        amount,
        from: address,
        ...(parsedSlippage !== undefined ? { slippage: parsedSlippage } : {}),
      }),
    });
    return {
      status: response.status,
      ok: response.ok,
      json: () => response.json(),
    };
  }

  async function handleQuote(): Promise<void> {
    if (!canQuote) return;
    setBusy("quote");
    setErrorKey(null);
    setQuote(null);
    try {
      const response = await postProxy("/api/dex/quote");
      if (response.status === 503) {
        setErrorKey("dex.proxyNotConfigured");
        return;
      }
      if (!response.ok) {
        setErrorKey("dex.quoteError");
        return;
      }
      const parsed = parseQuoteResponse(await response.json());
      if (!parsed.ok) {
        setErrorKey("dex.quoteError");
        return;
      }
      setQuote(parsed.value);
    } catch {
      setErrorKey("dex.quoteError");
    } finally {
      setBusy(null);
    }
  }

  async function handleSwap(): Promise<void> {
    if (!canSwap) return;
    setBusy("swap");
    setErrorKey(null);
    try {
      const response = await postProxy("/api/dex/swap");
      if (response.status === 503) {
        setErrorKey("dex.proxyNotConfigured");
        return;
      }
      if (!response.ok) {
        setErrorKey("dex.swapFailed");
        return;
      }
      const parsed = parseSwapResponse(await response.json());
      if (!parsed.ok) {
        setErrorKey("dex.swapFailed");
        return;
      }
      const tx = parsed.value.tx;
      if (!isEvmAddress(tx.to) || !isHexData(tx.data)) {
        setErrorKey("dex.swapFailed");
        return;
      }
      sendTransaction({
        to: tx.to,
        data: tx.data,
        value: isNonNegativeIntegerString(tx.value) ? BigInt(tx.value) : 0n,
        account: address,
        chainId,
      });
    } catch {
      setErrorKey("dex.swapFailed");
    } finally {
      setBusy(null);
    }
  }

  const inputClassName =
    "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white";
  const labelClassName = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <section
      aria-labelledby="dex-swap-title"
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <h2 id="dex-swap-title" className="text-xl font-semibold text-gray-900 dark:text-white">
        {t("dex.title")}
      </h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t("dex.subtitle")}</p>

      <div className="mt-4">
        <span id="dex-chain-label" className={labelClassName}>
          {t("dex.chain")}
        </span>
        <div role="group" aria-labelledby="dex-chain-label" className="mt-2 flex flex-wrap gap-2">
          {SUPPORTED_DEX_CHAINS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => selectChain(id)}
              aria-pressed={id === chainId}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                id === chainId
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {networks[id].shortName}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dex-src" className={labelClassName}>
            {t("dex.from")}
          </label>
          <input
            id="dex-src"
            type="text"
            spellCheck={false}
            value={src}
            onChange={(event) => setSrc(event.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="dex-dst" className={labelClassName}>
            {t("dex.to")}
          </label>
          <input
            id="dex-dst"
            type="text"
            spellCheck={false}
            value={dst}
            onChange={(event) => setDst(event.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="dex-amount" className={labelClassName}>
            {t("dex.amount")}
          </label>
          <input
            id="dex-amount"
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="dex-slippage" className={labelClassName}>
            {t("dex.slippage")}
          </label>
          <input
            id="dex-slippage"
            type="number"
            min="0.01"
            max="50"
            step="0.01"
            value={slippage}
            onChange={(event) => setSlippage(event.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleQuote}
          disabled={!canQuote}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("dex.getQuote")}
        </button>
        <button
          type="button"
          onClick={handleSwap}
          disabled={!canSwap}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy === "swap" || isTxPending ? t("dex.swapping") : t("dex.swap")}
        </button>
      </div>

      {!swapAvailable && (
        <p className="mt-3 text-sm text-yellow-600 dark:text-yellow-400">{t("dex.notAvailable")}</p>
      )}
      {!connected && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {t("auth.connectWallet.title")}
        </p>
      )}
      {errorKey && (
        <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
          {t(errorKey)}
        </p>
      )}
      {isTxSuccess && !errorKey && (
        <p role="status" className="mt-3 text-sm text-green-600 dark:text-green-400">
          {t("dex.swapSuccess")}
        </p>
      )}
      {isTxError && !errorKey && (
        <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
          {t("dex.swapFailed")}
        </p>
      )}

      {quote && (
        <dl className="mt-4 space-y-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t("dex.bestRate")}
            </dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">
              {quote.fromToken.symbol} → {quote.toToken.symbol}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t("dex.estimatedOutput")}
            </dt>
            <dd className="text-lg font-semibold text-gray-900 dark:text-white">
              {quote.toAmount}
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}
