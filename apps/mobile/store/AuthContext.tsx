import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://localhost:3000/api";

interface User {
  id: string;
  ethAddress?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  connectWallet: () => Promise<void>;
  signInWithEthereum: (address: string) => Promise<void>;
  verifyWallet: (
    address: string,
    signature: string,
    message: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  setAuthMode: (mode: string) => Promise<void>;
  walletAddress?: string;
  datingMode?: string;
  error?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

async function apiFetch(path: string, init?: RequestInit) {
  const sessionId = await AsyncStorage.getItem("evolve_session_id");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init?.headers as Record<string, string>) || {}),
  };
  if (sessionId) {
    headers["Authorization"] = `Bearer ${sessionId}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    const match = setCookie.match(
      /(?:siwe_session|email_session)=([^;]+)/,
    );
    if (match) {
      await AsyncStorage.setItem("evolve_session_id", match[1]);
    }
  }
  return res;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | undefined>();
  const [authError, setAuthError] = useState<string>("");
  const [datingMode, setDatingMode] = useState<string | undefined>();

  const isAuthenticated = !!user;

  useEffect(() => {
    checkSession();
    loadDatingMode();
  }, []);

  const loadDatingMode = async () => {
    const savedMode = await AsyncStorage.getItem("evolve_auth_mode");
    if (savedMode) {
      setDatingMode(savedMode);
    }
  };

  const setAuthMode = async (mode: string) => {
    await AsyncStorage.setItem("evolve_auth_mode", mode);
    setDatingMode(mode);
    try {
      await apiFetch("/auth/mode", {
        method: "POST",
        body: JSON.stringify({ mode }),
      });
    } catch (e) {
      console.error("Failed to save mode to backend:", e);
    }
  };

  const checkSession = async () => {
    setLoading(true);
    try {
      const sessionId = await AsyncStorage.getItem("evolve_session_id");
      if (!sessionId) {
        setLoading(false);
        return;
      }

      const endpoints = [
        "/auth/siwe/session",
        "/auth/email/session",
      ];

      for (const endpoint of endpoints) {
        try {
          const res = await apiFetch(endpoint);
          const data = await res.json();
          if (data.authenticated) {
            setUser({
              id: data.user.id,
              ethAddress: data.session.ethAddress,
              email: data.session.email,
            });
            setLoading(false);
            return;
          }
        } catch {}
      }
    } catch (e) {
      console.error("Session check failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiFetch("/auth/email/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser({ id: data.user.id, email: data.user.email });
      } else {
        throw new Error(data.error || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiFetch("/auth/email/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser({ id: data.user.id, email: data.user.email });
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    setWalletAddress(undefined);
  };

  const signInWithEthereum = async (address: string) => {
    setLoading(true);
    try {
      const nonceRes = await apiFetch("/auth/siwe/nonce");
      const { nonce } = await nonceRes.json();
      await AsyncStorage.setItem("evolve_siwe_nonce", nonce);
      await AsyncStorage.setItem("evolve_siwe_address", address);
      setWalletAddress(address);
    } finally {
      setLoading(false);
    }
  };

  const verifyWallet = async (
    address: string,
    signature: string,
    message: string,
  ) => {
    setLoading(true);
    try {
      const res = await apiFetch("/auth/siwe/verify", {
        method: "POST",
        body: JSON.stringify({ address, signature, message }),
      });
      const data = await res.json();
      if (data.success) {
        setUser({ id: data.user.id, ethAddress: data.user.ethAddress });
        await AsyncStorage.removeItem("evolve_siwe_nonce");
        await AsyncStorage.removeItem("evolve_siwe_address");
      } else {
        throw new Error(data.error || "SIWE verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user?.email) {
        await apiFetch("/auth/email/logout", { method: "POST" });
      } else {
        await apiFetch("/auth/siwe/logout", { method: "POST" });
      }
    } catch {}
    await AsyncStorage.removeItem("evolve_session_id");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        loginWithEmail,
        registerWithEmail,
        connectWallet,
        signInWithEthereum,
        verifyWallet,
        logout,
        setAuthMode,
        walletAddress,
        datingMode,
        error: authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
