import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import { BrowserProvider } from "ethers";
import { SiweMessage } from "siwe";
import {
  parseStdTestResult,
  StdTestParseResult,
  checkStdCompatibility,
  StdCompatibilityResult,
} from "../lib/std-parser";

export interface STRProfile {
  [locus: string]: [number, number];
}

export interface PDFDocument {
  id?: string;
  name: string;
  size: string;
  type: "STD" | "DNA";
  uploadDate: string;
  isRedacted: boolean;
  redactedFields: string[];
  status: "encrypted" | "decrypted";
  resultText: string;
  dnaProfile?: STRProfile;
}

export interface ChatMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  isRequest?: boolean;
  requestType?: "STD" | "DNA";
  requestStatus?: "pending" | "approved" | "declined";
}

export interface ProfileData {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  imageUrl?: string;
  verifiedStd: boolean;
  verifiedDna: boolean;
  reputationScore: number;
  voters: { name: string; weight: number; relation: string }[];
  chatHistory: ChatMessage[];
  accessPermissions: {
    stdRequested: boolean;
    stdApproved: boolean;
    dnaRequested: boolean;
    dnaApproved: boolean;
    myStdApprovedToThem: boolean;
    myDnaApprovedToThem: boolean;
  };
  dnaTestDetails?: STRProfile;
  stdTestResult?: string;
  parsedStd?: StdTestParseResult;
  authMode?: "normal" | "pregnancy-bond" | "cryptic-choice";
  hideProfileFromLowerLevels?: boolean;
}

interface AppContextType {
  myProfile: {
    id: string;
    name: string;
    reputationScore: number;
    voters: { name: string; weight: number; relation: string }[];
    stdUploaded: boolean;
    dnaUploaded: boolean;
    uploadedDocs: PDFDocument[];
    hideProfileFromLowerLevels: boolean;
  };
  profiles: ProfileData[];
  filters: {
    onlyVerifiedStd: boolean;
    onlyVerifiedDna: boolean;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{ onlyVerifiedStd: boolean; onlyVerifiedDna: boolean }>
  >;
  toggleHideProfile: () => void;
  uploadDocument: (doc: PDFDocument) => Promise<void>;
  requestAccess: (
    profileId: string,
    testType: "STD" | "DNA",
    t: any,
  ) => Promise<void>;
  approveAccess: (
    profileId: string,
    testType: "STD" | "DNA",
    t: any,
  ) => Promise<void>;
  denyAccess: (
    profileId: string,
    testType: "STD" | "DNA",
    t: any,
  ) => Promise<void>;
  addMessage: (
    profileId: string,
    text: string,
    sender?: "me" | "them",
    isRequest?: boolean,
    requestType?: "STD" | "DNA",
  ) => Promise<void>;
  checkCompatibility: (profile: ProfileData) => StdCompatibilityResult;

  // SIWE state & methods
  isAuthenticated: boolean;
  isConnected: boolean;
  address: string | null;
  loading: boolean;
  signInWithEthereum: () => Promise<void>;
  logout: () => Promise<void>;

  // Auth mode
  authMode: "normal" | "pregnancy-bond" | "cryptic-choice";
  setAuthMode: (mode: "normal" | "pregnancy-bond" | "cryptic-choice") => void;

  // Email auth
  emailUser: { id: string; email: string } | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;

  // Phone auth
  phoneUser: { id: string; phoneNumber: string } | null;
  phoneOtpSent: boolean;
  requestPhoneOtp: (phoneNumber: string) => Promise<void>;
  verifyPhoneOtp: (phoneNumber: string, otp: string) => Promise<void>;
  logoutPhone: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const apiFetch = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, { ...init, credentials: "include" });

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { address: wagmiAddress, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [authMode, setAuthModeState] = useState<
    "normal" | "pregnancy-bond" | "cryptic-choice"
  >(() => (localStorage.getItem("evolve_auth_mode") as any) || "normal");
  const [emailUser, setEmailUser] = useState<{
    id: string;
    email: string;
  } | null>(null);
  const [phoneUser, setPhoneUser] = useState<{
    id: string;
    phoneNumber: string;
  } | null>(null);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [myProfile, setMyProfile] = useState({
    id: "",
    name: "",
    reputationScore: 0,
    voters: [] as { name: string; weight: number; relation: string }[],
    stdUploaded: false,
    dnaUploaded: false,
    uploadedDocs: [] as PDFDocument[],
    hideProfileFromLowerLevels: false,
  });

  const [filters, setFilters] = useState({
    onlyVerifiedStd: false,
    onlyVerifiedDna: false,
  });

  const refreshData = async (userId: string) => {
    try {
      const profRes = await apiFetch("/api/profiles");
      const allProfiles = await profRes.json();

      const otherProfiles = allProfiles.filter((p: any) => p.userId !== userId);

      const formattedOtherProfiles = await Promise.all(
        otherProfiles.map(async (p: any) => {
          const msgRes = await apiFetch(
            `/api/messages?senderId=${userId}&receiverId=${p.userId}`,
          );
          const rawMsgs = await msgRes.json();
          const chatHistory: ChatMessage[] = rawMsgs.map((m: any) => ({
            id: m.id,
            sender: m.senderId === userId ? "me" : "them",
            text: m.text,
            time: m.time,
            isRequest: m.isRequest,
            requestType: m.requestType,
            requestStatus: m.requestStatus,
          }));

          const accessPermissions = p.accessPermissions || {
            stdRequested: false,
            stdApproved: false,
            dnaRequested: false,
            dnaApproved: false,
            myStdApprovedToThem: false,
            myDnaApprovedToThem: false,
          };

          return {
            id: p.userId,
            name: p.name,
            age: p.age,
            bio: p.bio,
            interests: p.interests || [],
            imageUrl: p.imageUrl,
            verifiedStd: p.verifiedStd,
            verifiedDna: p.verifiedDna,
            reputationScore: p.reputationScore,
            voters: p.voters || [],
            chatHistory,
            accessPermissions,
            dnaTestDetails: p.dnaProfile,
            stdTestResult: p.stdTestResult,
            parsedStd: p.stdTestResult
              ? parseStdTestResult(p.stdTestResult)
              : undefined,
            authMode: p.authMode || "normal",
            hideProfileFromLowerLevels: p.hideProfileFromLowerLevels || false,
          };
        }),
      );

      setProfiles(formattedOtherProfiles);

      const ourProfile = allProfiles.find((p: any) => p.userId === userId);
      if (ourProfile) {
        const docRes = await apiFetch(`/api/documents?userId=${userId}`);
        const uploadedDocs = await docRes.json();

        setMyProfile((prev) => ({
          ...prev,
          id: userId,
          name: ourProfile.name,
          reputationScore: ourProfile.reputationScore,
          voters: ourProfile.voters || prev.voters,
          stdUploaded: uploadedDocs.some((d: any) => d.type === "STD"),
          dnaUploaded: uploadedDocs.some((d: any) => d.type === "DNA"),
          uploadedDocs: uploadedDocs,
        }));
      }
    } catch (e) {
      console.error("Failed to load backend data", e);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const res = await apiFetch("/api/auth/siwe/session");
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setAddress(data.session.ethAddress);
          await refreshData(data.session.userId);
          setLoading(false);
          return;
        }

        const emailRes = await apiFetch("/api/auth/email/session");
        const emailData = await emailRes.json();
        if (emailData.authenticated) {
          setIsAuthenticated(true);
          setEmailUser({ id: emailData.user.id, email: emailData.user.email });
          await refreshData(emailData.session.userId);
          setLoading(false);
          return;
        }

        const phoneRes = await apiFetch("/api/auth/phone/session");
        const phoneData = await phoneRes.json();
        if (phoneData.authenticated) {
          setIsAuthenticated(true);
          setPhoneUser({
            id: phoneData.user.id,
            phoneNumber: phoneData.user.phoneNumber,
          });
          await refreshData(phoneData.session.userId);
          setLoading(false);
          return;
        }

        setIsAuthenticated(false);
        setAddress(null);
        setEmailUser(null);
        setPhoneUser(null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [isConnected]);

  const signInWithEthereum = async () => {
    if (!isConnected || !wagmiAddress) {
      throw new Error("Wallet not connected");
    }
    setLoading(true);
    try {
      const nonceRes = await apiFetch("/api/auth/siwe/nonce");
      const { nonce } = await nonceRes.json();

      const message = new SiweMessage({
        domain: window.location.host,
        address: wagmiAddress,
        statement: "Sign in with Ethereum to Evolve application.",
        uri: window.location.origin,
        version: "1",
        chainId: chainId,
        nonce: nonce,
      });

      const messageToSign = message.prepareMessage();

      const ethereum = (window as Window & { ethereum?: unknown }).ethereum;
      if (!ethereum) {
        throw new Error("No Ethereum provider found");
      }
      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(messageToSign);

      const verifyRes = await apiFetch("/api/auth/siwe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message, signature }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setIsAuthenticated(true);
        setAddress(wagmiAddress);
        await refreshData(verifyData.user.id);
      } else {
        throw new Error("SIWE Verification failed");
      }
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/email/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailUser({ id: data.user.id, email: data.user.email });
        setIsAuthenticated(true);
        await refreshData(data.user.id);
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/email/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailUser({ id: data.user.id, email: data.user.email });
        setIsAuthenticated(true);
        await refreshData(data.user.id);
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (emailUser) {
        await apiFetch("/api/auth/email/logout", { method: "POST" });
        setEmailUser(null);
      } else if (phoneUser) {
        await apiFetch("/api/auth/phone/logout", { method: "POST" });
        setPhoneUser(null);
      } else {
        await apiFetch("/api/auth/siwe/logout", { method: "POST" });
        disconnect();
      }
      setIsAuthenticated(false);
      setAddress(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const requestPhoneOtp = async (phoneNumber: string) => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/phone/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setPhoneOtpSent(true);
      } else {
        throw new Error(data.error || "Failed to send OTP");
      }
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async (phoneNumber: string, otp: string) => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/phone/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setPhoneUser({ id: data.user.id, phoneNumber: data.user.phoneNumber });
        setIsAuthenticated(true);
        setPhoneOtpSent(false);
        await refreshData(data.user.id);
      } else {
        throw new Error(data.error || "OTP verification failed");
      }
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logoutPhone = async () => {
    setLoading(true);
    try {
      await apiFetch("/api/auth/phone/logout", { method: "POST" });
      setPhoneUser(null);
      setIsAuthenticated(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const setAuthMode = (
    mode: "normal" | "pregnancy-bond" | "cryptic-choice",
  ) => {
    localStorage.setItem("evolve_auth_mode", mode);
    setAuthModeState(mode);
  };

  const uploadDocument = async (doc: PDFDocument) => {
    if (!myProfile.id) return;
    try {
      const res = await apiFetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: myProfile.id,
          name: doc.name,
          size: doc.size,
          type: doc.type,
          uploadDate: doc.uploadDate,
          isRedacted: doc.isRedacted,
          redactedFields: doc.redactedFields,
          status: doc.status,
          resultText: doc.resultText,
          dnaProfile: doc.dnaProfile,
        }),
      });
      const savedDoc = await res.json();

      setMyProfile((prev) => {
        const isStd = doc.type === "STD";
        const isDna = doc.type === "DNA";
        return {
          ...prev,
          stdUploaded: prev.stdUploaded || isStd,
          dnaUploaded: prev.dnaUploaded || isDna,
          uploadedDocs: [...prev.uploadedDocs, savedDoc],
        };
      });

      const isStd = doc.type === "STD";
      const isDna = doc.type === "DNA";
      await apiFetch("/api/profiles/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: myProfile.name,
          age: 28,
          bio: "Passionate about Web3 and security.",
          verifiedStd: myProfile.stdUploaded || isStd,
          verifiedDna: myProfile.dnaUploaded || isDna,
          reputationScore: myProfile.reputationScore,
          voters: myProfile.voters,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const addMessage = async (
    profileId: string,
    text: string,
    sender: "me" | "them" = "me",
    isRequest?: boolean,
    requestType?: "STD" | "DNA",
  ) => {
    if (!myProfile.id) return;
    try {
      const timeStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const res = await apiFetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: sender === "me" ? myProfile.id : profileId,
          receiverId: sender === "me" ? profileId : myProfile.id,
          text,
          time: timeStr,
          isRequest: !!isRequest,
          requestType,
          requestStatus: isRequest ? "pending" : undefined,
        }),
      });
      const savedMsg = await res.json();

      setProfiles((prev) =>
        prev.map((p) => {
          if (p.id === profileId) {
            return {
              ...p,
              chatHistory: [
                ...p.chatHistory,
                {
                  id: savedMsg.id,
                  sender,
                  text,
                  time: timeStr,
                  isRequest,
                  requestType,
                  requestStatus: isRequest ? "pending" : undefined,
                },
              ],
            };
          }
          return p;
        }),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const requestAccess = async (
    profileId: string,
    testType: "STD" | "DNA",
    t: any,
  ) => {
    if (!myProfile.id) return;

    const profile = profiles.find((p) => p.id === profileId);
    if (!profile) return;

    const isStd = testType === "STD";
    const updatedPermissions = {
      ...profile.accessPermissions,
      stdRequested: isStd ? true : profile.accessPermissions.stdRequested,
      dnaRequested: !isStd ? true : profile.accessPermissions.dnaRequested,
    };

    try {
      setProfiles((prev) =>
        prev.map((p) => {
          if (p.id === profileId) {
            return {
              ...p,
              accessPermissions: updatedPermissions,
            };
          }
          return p;
        }),
      );

      await addMessage(
        profileId,
        t("chat.requestAccess", { testType }),
        "me",
        true,
        testType,
      );
    } catch (e) {
      console.error(e);
    }
  };

  const approveAccess = async (
    profileId: string,
    testType: "STD" | "DNA",
    t: any,
  ) => {
    if (!myProfile.id) return;
    const profile = profiles.find((p) => p.id === profileId);
    if (!profile) return;

    const isStd = testType === "STD";
    const updatedPermissions = {
      ...profile.accessPermissions,
      myStdApprovedToThem: isStd
        ? true
        : profile.accessPermissions.myStdApprovedToThem,
      myDnaApprovedToThem: !isStd
        ? true
        : profile.accessPermissions.myDnaApprovedToThem,
    };

    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          return {
            ...p,
            accessPermissions: updatedPermissions,
          };
        }
        return p;
      }),
    );

    await addMessage(profileId, t("chat.approvedResponse", { testType }), "me");
  };

  const denyAccess = async (
    profileId: string,
    testType: "STD" | "DNA",
    t: any,
  ) => {
    if (!myProfile.id) return;
    await addMessage(profileId, t("chat.declinedResponse", { testType }), "me");
  };

  const toggleHideProfile = () => {
    setMyProfile((prev) => ({
      ...prev,
      hideProfileFromLowerLevels: !prev.hideProfileFromLowerLevels,
    }));
  };

  // Get current user's parsed STD result
  const myParsedStd = myProfile.stdUploaded
    ? parseStdTestResult(
        // Use the first uploaded STD document's result text
        myProfile.uploadedDocs.find((d) => d.type === "STD")?.resultText || "",
      )
    : undefined;

  const checkCompatibility = (profile: ProfileData): StdCompatibilityResult => {
    if (!myParsedStd || !profile.parsedStd) {
      return {
        safe: false,
        riskLevel: "potential_risk",
        reason: "STD test data missing for one or both partners",
        sharedPathogens: [],
        riskyPathogens: [],
      };
    }
    return checkStdCompatibility(myParsedStd, profile.parsedStd);
  };

  return (
    <AppContext.Provider
      value={{
        myProfile,
        profiles,
        filters,
        setFilters,
        toggleHideProfile,
        uploadDocument,
        requestAccess,
        approveAccess,
        denyAccess,
        addMessage,
        checkCompatibility,

        isAuthenticated,
        isConnected,
        address,
        loading,
        signInWithEthereum,
        logout,

        authMode,
        setAuthMode,
        emailUser,
        loginWithEmail,
        registerWithEmail,

        phoneUser,
        phoneOtpSent,
        requestPhoneOtp,
        verifyPhoneOtp,
        logoutPhone,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
