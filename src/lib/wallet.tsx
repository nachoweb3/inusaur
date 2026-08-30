"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { config } from "@/data/config";

/* ────────────────────────────────────────────────────────────────
   SHINY CAPIBARA — wallet layer (zero dependencies)
   Talks to injected Solana providers (Phantom, Solflare) and to
   public RPC endpoints for balances. Safe for the static export.
   ──────────────────────────────────────────────────────────────── */

type InjectedProvider = {
  publicKey?: { toString(): string } | null;
  isConnected?: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<unknown>;
  disconnect: () => Promise<void>;
  on?: (event: string, handler: (payload?: unknown) => void) => void;
  removeListener?: (event: string, handler: (payload?: unknown) => void) => void;
};

declare global {
  interface Window {
    phantom?: { solana?: InjectedProvider };
    solflare?: InjectedProvider;
    solana?: InjectedProvider;
  }
}

export type WalletId = "phantom" | "solflare";

const STORAGE_KEY = "sbara:wallet";

const RPC_ENDPOINTS = [
  "https://solana-rpc.publicnode.com",
  "https://api.mainnet-beta.solana.com",
];

const SPL_TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const LAMPORTS_PER_SOL = 1_000_000_000;

export const WALLET_META: Record<WalletId, { name: string; installUrl: string }> = {
  phantom: { name: "Phantom", installUrl: "https://phantom.app/download" },
  solflare: { name: "Solflare", installUrl: "https://solflare.com/download" },
};

export function shorten(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

function getInjected(id: WalletId): InjectedProvider | null {
  if (typeof window === "undefined") return null;
  if (id === "phantom") return window.phantom?.solana ?? window.solana ?? null;
  return window.solflare ?? null;
}

/* ── RPC helpers (with endpoint fallback) ───────────────────────── */

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  let lastError: unknown = new Error("no RPC endpoint reachable");
  for (const endpoint of RPC_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { result?: T; error?: { message: string } };
      if (json.error) throw new Error(json.error.message);
      return json.result as T;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

async function fetchBalances(address: string): Promise<{
  sol: number | null;
  sbara: number | null;
}> {
  const solRes = await rpc<{ value: number }>("getBalance", [
    address,
    { commitment: "confirmed" },
  ]);

  let sbara: number | null = null;
  try {
    const tokenRes = await rpc<{
      value: {
        account: {
          data: {
            parsed: { info: { tokenAmount: { uiAmount: number | null } } };
          };
        };
      }[];
    }>(
      "getTokenAccountsByOwner",
      [
        address,
        { mint: config.contractAddress, programId: SPL_TOKEN_PROGRAM },
        { encoding: "jsonParsed", commitment: "confirmed" },
      ],
    );
    sbara = tokenRes.value.reduce(
      (sum, acc) => sum + (acc.account.data.parsed.info.tokenAmount.uiAmount ?? 0),
      0,
    );
  } catch {
    sbara = null; // token index unavailable — show "—" in the UI
  }

  return { sol: solRes.value / LAMPORTS_PER_SOL, sbara };
}

/* ── Context ────────────────────────────────────────────────────── */

type WalletContextValue = {
  address: string | null;
  walletId: WalletId | null;
  connecting: boolean;
  refreshing: boolean;
  balances: { sol: number | null; sbara: number | null };
  installed: WalletId[];
  connect: (id: WalletId) => Promise<void>;
  disconnect: () => void;
  refresh: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<WalletId | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [balances, setBalances] = useState<{ sol: number | null; sbara: number | null }>({
    sol: null,
    sbara: null,
  });
  const [installed, setInstalled] = useState<WalletId[]>([]);

  const providerRef = useRef<InjectedProvider | null>(null);
  const addressRef = useRef<string | null>(null);

  /* Keep the ref in sync outside render (effects are the sanctioned place). */
  useEffect(() => {
    addressRef.current = address;
  }, [address]);

  const refresh = useCallback(async () => {
    const addr = addressRef.current;
    if (!addr) return;
    setRefreshing(true);
    try {
      setBalances(await fetchBalances(addr));
    } catch {
      setBalances({ sol: null, sbara: null });
    } finally {
      setRefreshing(false);
    }
  }, []);

  const attachListeners = useCallback(
    (provider: InjectedProvider) => {
      provider.on?.("accountChanged", (payload) => {
        const pk = payload as { toString(): string } | null | undefined;
        const next = pk?.toString() ?? null;
        if (next) {
          setAddress(next);
          setBalances({ sol: null, sbara: null });
          void refresh();
        } else {
          // Wallet locked / removed the account — treat as disconnect.
          setAddress(null);
          setWalletId(null);
          setBalances({ sol: null, sbara: null });
          providerRef.current = null;
        }
      });
      provider.on?.("disconnect", () => {
        setAddress(null);
        setWalletId(null);
        setBalances({ sol: null, sbara: null });
        providerRef.current = null;
      });
    },
    [refresh],
  );

  const connect = useCallback(
    async (id: WalletId) => {
      const provider = getInjected(id);
      if (!provider) return;
      setConnecting(true);
      try {
        await provider.connect();
        const pk = (
          provider as { publicKey?: { toString(): string } | null }
        ).publicKey;
        const addr = pk?.toString() ?? null;
        if (addr) {
          providerRef.current = provider;
          setAddress(addr);
          setWalletId(id);
          setBalances({ sol: null, sbara: null });
          localStorage.setItem(STORAGE_KEY, id);
          attachListeners(provider);
          await refresh();
        }
      } catch (err) {
        // User rejected the request — surface nothing, stay idle.
        console.warn("[wallet] connect failed", err);
      } finally {
        setConnecting(false);
      }
    },
    [attachListeners, refresh],
  );

  const disconnect = useCallback(() => {
    try {
      void providerRef.current?.disconnect();
    } catch {
      /* provider already gone */
    }
    providerRef.current = null;
    localStorage.removeItem(STORAGE_KEY);
    setAddress(null);
    setWalletId(null);
    setBalances({ sol: null, sbara: null });
  }, []);

  /* Detect injected wallets (re-check on load — extensions inject late). */
  useEffect(() => {
    const detect = () => {
      const found = (["phantom", "solflare"] as WalletId[]).filter(
        (id) => getInjected(id) !== null,
      );
      setInstalled(found);
      return found;
    };
    detect();
    window.addEventListener("load", detect);
    return () => window.removeEventListener("load", detect);
  }, []);

  /* Eager reconnect (onlyIfTrusted) + periodic balance refresh. */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as WalletId | null;
    if (!stored) return;
    const provider = getInjected(stored);
    if (!provider) return;

    let cancelled = false;
    (async () => {
      try {
        await provider.connect({ onlyIfTrusted: true });
        if (cancelled) return;
        const pk = (
          provider as { publicKey?: { toString(): string } | null }
        ).publicKey;
        const addr = pk?.toString() ?? null;
        if (addr) {
          providerRef.current = provider;
          setAddress(addr);
          setWalletId(stored);
          attachListeners(provider);
          void refresh();
        }
      } catch {
        /* not trusted yet — user must click connect */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [attachListeners, refresh]);

  useEffect(() => {
    if (!address) return;
    const interval = setInterval(() => void refresh(), 60_000);
    return () => clearInterval(interval);
  }, [address, refresh]);

  const value = useMemo<WalletContextValue>(
    () => ({
      address,
      walletId,
      connecting,
      refreshing,
      balances,
      installed,
      connect,
      disconnect,
      refresh,
    }),
    [
      address,
      walletId,
      connecting,
      refreshing,
      balances,
      installed,
      connect,
      disconnect,
      refresh,
    ],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside <WalletProvider>");
  return ctx;
}
