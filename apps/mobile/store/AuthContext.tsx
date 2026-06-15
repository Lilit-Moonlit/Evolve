import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://localhost:3000/api";

interface User {
  id: string;
  ethAddress?: string;
  email?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  requestPhoneOtp: (phoneNumber: string) => Promise<void>;
  verifyPhoneOtp: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
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
      /(?:siwe_session|email_session|phone_session)=([^;]+)/,
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

  const isAuthenticated = !!user;

  useEffect(() => {
    checkSession();
  }, []);

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
        "/auth/phone/session",
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
              phoneNumber: data.session.phoneNumber,
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

  const requestPhoneOtp = async (phoneNumber: string) => {
    setLoading(true);
    try {
      const res = await apiFetch("/auth/phone/request-otp", {
        method: "POST",
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async (phoneNumber: string, otp: string) => {
    setLoading(true);
    try {
      const res = await apiFetch("/auth/phone/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phoneNumber, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setUser({ id: data.user.id, phoneNumber: data.user.phoneNumber });
      } else {
        throw new Error(data.error || "OTP verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user?.email) {
        await apiFetch("/auth/email/logout", { method: "POST" });
      } else if (user?.phoneNumber) {
        await apiFetch("/auth/phone/logout", { method: "POST" });
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
        requestPhoneOtp,
        verifyPhoneOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
