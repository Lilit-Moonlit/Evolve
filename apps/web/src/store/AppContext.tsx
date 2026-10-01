import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EvolveMode, LOCAL_STORAGE_KEYS } from "@evolve/core/browser";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import { BrowserProvider } from "ethers";
import { SiweMessage } from "siwe";
import {
  parseStdTestResult,
  StdTestParseResult,
  checkStdCompatibility,
  StdCompatibilityResult,
} from "../lib/std-parser";
import { STRProfile, parseDNATest, generateDNAHash, validateDNAProfile } from "../lib/dna-parser";
import { usePublicClient, useWalletClient } from "wagmi";
import { DNAVerificationABI } from "../lib/abi/DNAVerificationABI";
import { CONTRACTS } from "../lib/addresses";
import {
  canViewPhoto,
  grantPhotoAccess,
  revokePhotoAccess as revokeGrant,
  temporaryRemainingMs,
  type PhotoGrant,
  type PhotoGrantKind,
  type PhotoGrants,
} from "../lib/photo-access";

export type { STRProfile }; // Exporting for external use

// Deployed contract addresses — Ethereum Sepolia (see lib/addresses.ts,
// deployed 2026-08-21 via deploy-sepolia.mjs).
const DNA_VERIFICATION_ADDRESS = CONTRACTS.DNA_VERIFICATION as `0x${string}`;

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
  dnaHash?: string;
}

export interface ChatMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  isRequest?: boolean;
  requestType?: "STD" | "DNA" | "PHOTO" | "LIVENESS";
  requestStatus?: "pending" | "approved" | "declined";
  /** Present on photo approve/offer messages: what kind of access was given. */
  photoGrantKind?: "temporary" | "permanent";
  /** Photo flow action: approve / deny a request, or a proactive offer. */
  photoAction?: "approve" | "deny" | "offer";
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
  /** True when the server knows a conversation exists with this profile
   * (from `/api/messages/peers`). chatHistory is then fetched lazily via
   * `loadChatHistory()` when the chat is actually opened. */
  hasChat?: boolean;
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
  authMode?: EvolveMode;
  hideProfileFromLowerLevels?: boolean;
  location?: { lat: number; lng: number };
  ageHidden?: boolean;
  languages?: string[];
  photoBlurred?: boolean;
  photoGrants?: PhotoGrants;
  onboardingComplete?: boolean;
  faceVerified?: boolean;
  faceHash?: string | null;
  lastLivenessCheck?: string | null;
  searchDetails?: SearchDetails;
}

/**
 * Optional physical / lifestyle fields used by the extended search filters.
 * Persisted on the profile as a single JSON object (`searchDetails`).
 */
export interface SearchDetails {
  height?: number; // cm
  weight?: number; // kg
  gender?: string; // "male" | "female" | "other"
  /** Profile kind declared at registration: "woman" | "man" |
   * "couple_man_woman" | "couple_man_man" | "couple_woman_woman" |
   * "laboratory". Drives search/feature behavior; gender/lookingFor are
   * kept in sync via lib/profile-kind helpers. */
  kind?: string;
  lookingFor?: string; // "man" | "woman" | "couple_man_woman" | "couple_woman_woman" | "couple_man_man"
  skinColor?: string;
  eyeColor?: string;
  hairColor?: string;
  bodyType?: string;
  education?: string;
  maritalStatus?: string;
  children?: boolean;
  smoking?: boolean;
  drinking?: boolean;
  religion?: string;
  zodiac?: string;
  country?: string;
  city?: string;
  /** User declares they can travel to the searcher's country. */
  canTravel?: boolean;
  /** Destination countries (canonical English names) the user can travel
   * to. Empty/absent with canTravel=true = legacy "anywhere". */
  canTravelCountries?: string[];
  /** Lab testing preference — which STD/DNA tests the user is happy to do. */
  testingPreference?: string;
}

export interface ProfileSearchDetails extends SearchDetails {}

/** Extended search / filter state, persisted to localStorage. */
export interface FilterState {
  /** Legacy first filter (man/woman/laboratory). Only "laboratory" is still
   * set — by the "Здати ІПСШ тести" option of the What filter. When set,
   * only country + city filters apply (labs have no age etc.). */
  searchTarget?: "man" | "woman" | "laboratory";
  /** "Кого шукаєте" — conditional Who filter, options depend on the selected
   * What (search mode / laboratory) and the user's own gender. */
  searchWho?: string;
  /** Show only STD-compatible profiles (anonymous verdict, never raw status). */
  stdCompatibleOnly: boolean;
  /** Show only profiles who declared they can travel to my country. */
  canTravelOnly: boolean;
  onlyVerifiedStd: boolean;
  onlyVerifiedDna: boolean;
  interestFilter: string[];
  locationFilter: number; // radius in km
  minAge?: number;
  maxAge?: number;
  minHeight?: number;
  maxHeight?: number;
  minWeight?: number;
  maxWeight?: number;
  country?: string;
  city?: string;
  lookingFor?: string;
  skinColor?: string;
  eyeColor?: string;
  hairColor?: string;
  bodyType?: string;
  education?: string;
  maritalStatus?: string;
  children?: boolean;
  smoking?: boolean;
  drinking?: boolean;
  religion?: string;
  zodiac?: string;
  languages?: string[];
  /** Lab testing preference — which STD/DNA tests the user prefers. */
  testingPreference?: string;
}

export interface ProfilePatch extends SearchDetails {
  name?: string;
  age?: number;
  ageHidden?: boolean;
  bio?: string;
  imageUrl?: string;
  languages?: string[];
  photoBlurred?: boolean;
  photoGrants?: PhotoGrants;
  onboardingComplete?: boolean;
  faceVerified?: boolean;
  faceHash?: string | null;
  lastLivenessCheck?: string | null;
  faceEmbedding?: number[] | null;
  interests?: string[];
  searchDetails?: SearchDetails;
}

interface AppContextType {
  myProfile: {
    id: string;
    name: string;
    age: number;
    ageHidden: boolean;
    bio: string;
    imageUrl?: string;
    languages: string[];
    photoBlurred: boolean;
    photoGrants: PhotoGrants;
    onboardingComplete: boolean;
    faceVerified: boolean;
    faceHash: string | null;
    lastLivenessCheck: string | null;
    reputationScore: number;
    voters: { name: string; weight: number; relation: string }[];
    stdUploaded: boolean;
    dnaUploaded: boolean;
    uploadedDocs: PDFDocument[];
    hideProfileFromLowerLevels: boolean;
    parsedStd?: StdTestParseResult;
    dnaProfile?: STRProfile | null;
    isDnaVerified: boolean;
    faceEmbedding?: number[];
    searchDetails?: SearchDetails;
  };
  profiles: ProfileData[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>;
  toggleHideProfile: () => void;
  uploadDocument: (doc: PDFDocument) => Promise<void>;
  requestAccess: (profileId: string, testType: "STD" | "DNA", t: any) => Promise<void>;
  approveAccess: (profileId: string, testType: "STD" | "DNA", t: any) => Promise<void>;
  denyAccess: (profileId: string, testType: "STD" | "DNA", t: any) => Promise<void>;
  addMessage: (
    profileId: string,
    text: string,
    sender?: "me" | "them",
    isRequest?: boolean,
    requestType?: "STD" | "DNA" | "PHOTO" | "LIVENESS",
  ) => Promise<void>;
  /** Lazy-loads the chat history for one profile (called when a chat opens). */
  loadChatHistory: (profileId: string) => Promise<void>;
  checkCompatibility: (profile: ProfileData) => StdCompatibilityResult;
  saveProfile: (patch: ProfilePatch) => Promise<void>;
  completeOnboarding: (patch: ProfilePatch) => Promise<void>;
  requestPhotoAccess: (profileId: string, t: any) => Promise<void>;
  approvePhotoAccess: (profileId: string, kind: PhotoGrantKind, t: any) => Promise<void>;
  denyPhotoAccess: (profileId: string, t: any) => Promise<void>;
  offerPhotoAccess: (profileId: string, kind: PhotoGrantKind, t: any) => Promise<void>;
  revokePhotoAccess: (profileId: string, t: any) => Promise<void>;
  canViewTheirPhoto: (profile: ProfileData) => boolean;
  theirPhotoRemainingMs: (profile: ProfileData) => number;
  myPhotoGrantFor: (profileId: string) => PhotoGrant | undefined;

  // SIWE state & methods
  isAuthenticated: boolean;
  isConnected: boolean;
  address: string | null;
  loading: boolean;
  signInWithEthereum: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // Auth mode
  authMode: EvolveMode;
  setAuthMode: (mode: EvolveMode) => void;

  // Search mode (filter)
  searchMode: EvolveMode;
  setSearchMode: (mode: EvolveMode) => void;

  // DNA Verification
  dnaProfile: STRProfile | null;
  isDnaVerified: boolean;
  isDnaVerifying: boolean;
  isDnaRevoking: boolean;
  dnaVerificationError: string | null;
  setDnaVerificationError: (error: string | null) => void;
  uploadDNA: (profile: STRProfile, rawText: string) => Promise<void>;
  verifyDNA: (profile: STRProfile, rawText: string) => Promise<void>;
  revokeDNA: () => Promise<void>;
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

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address: wagmiAddress, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [authMode, setAuthModeState] = useState<EvolveMode>(
    () => (localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_MODE) as EvolveMode | null) || "normal",
  );
  const [searchMode, setSearchModeState] = useState<EvolveMode>(
    () => (localStorage.getItem(LOCAL_STORAGE_KEYS.SEARCH_MODE) as EvolveMode | null) || "normal",
  );
  const [emailUser, setEmailUser] = useState<{
    id: string;
    email: string;
  } | null>(null);

  const [dnaProfile, setDnaProfile] = useState<STRProfile | null>(null);
  const [isDnaVerified, setIsDnaVerified] = useState(false);
  const [isDnaVerifying, setIsDnaVerifying] = useState(false);
  const [isDnaRevoking, setIsDnaRevoking] = useState(false);
  const [dnaVerificationError, setDnaVerificationError] = useState<string | null>(null);

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [myProfile, setMyProfile] = useState({
    id: "",
    name: "",
    age: 0,
    ageHidden: false,
    bio: "",
    imageUrl: "" as string | undefined,
    languages: [] as string[],
    photoBlurred: false,
    photoGrants: {} as PhotoGrants,
    onboardingComplete: false,
    faceVerified: false,
    faceHash: null as string | null,
    lastLivenessCheck: null as string | null,
    reputationScore: 0,
    voters: [] as { name: string; weight: number; relation: string }[],
    stdUploaded: false,
    dnaUploaded: false,
    uploadedDocs: [] as PDFDocument[],
    hideProfileFromLowerLevels: false,
    dnaProfile: null as STRProfile | null,
    isDnaVerified: false,
    searchDetails: {} as SearchDetails,
  });

  const [filters, setFilters] = useState<FilterState>(() => {
    try {
      const raw = localStorage.getItem("evolve_search_filters");
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          onlyVerifiedStd: false,
          onlyVerifiedDna: false,
          stdCompatibleOnly: false,
          canTravelOnly: false,
          interestFilter: [] as string[],
          locationFilter: 0,
          ...parsed,
        };
      }
    } catch {
      /* ignore malformed stored filters */
    }
    return {
      onlyVerifiedStd: false,
      onlyVerifiedDna: false,
      stdCompatibleOnly: false,
      canTravelOnly: false,
      interestFilter: [] as string[],
      locationFilter: 0, // 0 means no location filter
    };
  });

  // Persist filters to localStorage whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem("evolve_search_filters", JSON.stringify(filters));
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [filters]);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const refreshData = async (userId: string, ethAddress?: string | null) => {
    try {
      const profRes = await apiFetch("/api/profiles");
      const profData = await profRes.json();
      const allProfiles = Array.isArray(profData) ? profData : [];

      const otherProfiles = allProfiles.filter((p: any) => p.userId !== userId);

      // Fetch the set of conversation partners once (lightweight) instead of
      // one `/api/messages` request per profile — the old N+1 pattern blew the
      // global rate limit (429 spam) on profile load. Chat histories load
      // lazily on chat open via loadChatHistory().
      let chatPeers = new Set<string>();
      try {
        const peersRes = await apiFetch(`/api/messages/peers?userId=${userId}`);
        const peersData = await peersRes.json();
        chatPeers = new Set(Array.isArray(peersData) ? peersData : []);
      } catch (e) {
        console.warn("Failed to load conversation peers", e);
      }

      const formattedOtherProfiles = otherProfiles.map((p: any) => {
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
          ageHidden: p.ageHidden || false,
          languages: p.languages || [],
          photoBlurred: p.photoBlurred || false,
          photoGrants: p.photoGrants || {},
          onboardingComplete: p.onboardingComplete,
          faceVerified: (p as any).faceVerified || false,
          faceHash: (p as any).faceHash || null,
          lastLivenessCheck: (p as any).lastLivenessCheck || null,
          verifiedStd: p.verifiedStd,
          verifiedDna: p.verifiedDna,
          reputationScore: p.reputationScore,
          voters: p.voters || [],
          chatHistory: [],
          hasChat: chatPeers.has(p.userId),
          accessPermissions,
          dnaTestDetails: p.dnaProfile,
          stdTestResult: p.stdTestResult,
          // Prefer the server-persisted parse ("fast-search format"); fall
          // back to client-side parsing only for profiles stored before the
          // column existed.
          parsedStd:
            p.parsedStd ?? (p.stdTestResult ? parseStdTestResult(p.stdTestResult) : undefined),
          authMode: p.authMode || "normal",
          hideProfileFromLowerLevels: p.hideProfileFromLowerLevels || false,
          location: p.location,
          searchDetails: p.searchDetails || {},
        };
      });

      setProfiles(formattedOtherProfiles);

      const ourProfile = allProfiles.find((p: any) => p.userId === userId);
      if (ourProfile) {
        const docRes = await apiFetch(`/api/documents?userId=${userId}`);
        const docData = await docRes.json();
        const uploadedDocs = Array.isArray(docData) ? docData : [];

        setMyProfile((prev) => ({
          ...prev,
          id: userId,
          name: ourProfile.name,
          age: ourProfile.age || 0,
          ageHidden: ourProfile.ageHidden || false,
          bio: ourProfile.bio || "",
          imageUrl: ourProfile.imageUrl || "",
          languages: ourProfile.languages || [],
          photoBlurred: ourProfile.photoBlurred || false,
          photoGrants: ourProfile.photoGrants || {},
          onboardingComplete:
            ourProfile.onboardingComplete !== undefined ? ourProfile.onboardingComplete : true,
          reputationScore: ourProfile.reputationScore,
          voters: ourProfile.voters || prev.voters,
          stdUploaded: uploadedDocs.some((d: any) => d.type === "STD"),
          dnaUploaded: uploadedDocs.some((d: any) => d.type === "DNA"),
          uploadedDocs: uploadedDocs,
          parsedStd:
            ourProfile.parsedStd ??
            (ourProfile.stdTestResult ? parseStdTestResult(ourProfile.stdTestResult) : undefined),
          dnaProfile: ourProfile.dnaProfile,
          isDnaVerified: ourProfile.verifiedDna,
          searchDetails: ourProfile.searchDetails || {},
          faceVerified: ourProfile.faceVerified || false,
          faceHash: ourProfile.faceHash || null,
          lastLivenessCheck: ourProfile.lastLivenessCheck || null,
        }));

        // On-chain DNA flag (wallet sessions only): chain truth wins when set.
        if (ethAddress && publicClient) {
          try {
            const chainVerified = (await publicClient.readContract({
              address: DNA_VERIFICATION_ADDRESS,
              abi: DNAVerificationABI,
              functionName: "isDNAVerified",
              args: [ethAddress.toLowerCase() as `0x${string}`],
            })) as boolean;
            if (chainVerified) {
              setMyProfile((prev) => ({ ...prev, isDnaVerified: true }));
            }
          } catch (chainErr) {
            console.warn("On-chain DNA status unavailable", chainErr);
          }
        }
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
          await refreshData(data.session.userId, data.session.ethAddress);
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

        setIsAuthenticated(false);
        setAddress(null);
        setEmailUser(null);
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
        await refreshData(verifyData.user.id, wagmiAddress);
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

  const setAuthMode = (mode: EvolveMode) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_MODE, mode);
    setAuthModeState(mode);
  };

  const setSearchMode = (mode: EvolveMode) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_MODE, mode);
    setSearchModeState(mode);
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
          dnaHash: doc.dnaHash,
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

      await apiFetch("/api/profiles/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: myProfile.name,
          age: 28,
          bio: "Passionate about Web3 and security.",
          verifiedStd: myProfile.stdUploaded || doc.type === "STD",
          verifiedDna: myProfile.dnaUploaded || doc.type === "DNA",
          // Self-uploaded STD tests must reach the profile so compatibility
          // search (parsedStd) works for this user. Server persists the parsed
          // form automatically when stdTestResult is present.
          stdTestResult: doc.type === "STD" ? doc.resultText : undefined,
          reputationScore: myProfile.reputationScore,
          voters: myProfile.voters,
          dnaProfile: doc.dnaProfile,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const uploadDNA = async (profile: STRProfile, rawText: string) => {
    if (!myProfile.id) return;
    const dnaHash = await generateDNAHash(profile);
    await uploadDocument({
      name: `DNA Test (${new Date().toLocaleDateString()})`,
      size: `${new TextEncoder().encode(rawText).length} bytes`,
      type: "DNA",
      uploadDate: new Date().toISOString(),
      isRedacted: false,
      redactedFields: [],
      status: "decrypted",
      resultText: rawText,
      dnaProfile: profile,
      dnaHash: dnaHash,
    });
    setDnaProfile(profile);
    setIsDnaVerified(false); // Will be set to true after successful on-chain verification
  };

  const verifyDNA = async (profile: STRProfile, rawText: string) => {
    if (!walletClient || !publicClient || !wagmiAddress || !myProfile.id) {
      setDnaVerificationError("Wallet not connected or profile not loaded.");
      return;
    }

    setIsDnaVerifying(true);
    setDnaVerificationError(null);

    try {
      const dnaHash = await generateDNAHash(profile);

      // Authoritative on-chain status check (DNAVerification, Sepolia).
      const isVerifiedOnChain = (await publicClient.readContract({
        address: DNA_VERIFICATION_ADDRESS,
        abi: DNAVerificationABI,
        functionName: "isDNAVerified",
        args: [wagmiAddress as `0x${string}`],
      })) as boolean;
      if (isVerifiedOnChain) {
        setIsDnaVerified(true);
        setDnaVerificationError("DNA is already verified on-chain.");
        setIsDnaVerifying(false);
        return;
      }

      // On-chain verifyDNA is verifier-gated (onlyVerifier), so the backend
      // relays the request with its admin verifier key. Privacy: only the
      // derived dnaHash leaves the device — never the raw test text.
      const relayRes = await apiFetch("/api/verification/dna/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dnaHash }),
      });
      const relayData = await relayRes.json();
      if (!relayRes.ok || !relayData.success) {
        throw new Error(relayData.error || "DNA verification request failed");
      }

      const confirmedOnChain = (await publicClient.readContract({
        address: DNA_VERIFICATION_ADDRESS,
        abi: DNAVerificationABI,
        functionName: "isDNAVerified",
        args: [wagmiAddress as `0x${string}`],
      })) as boolean;
      if (!confirmedOnChain) {
        throw new Error("On-chain DNA verification was not confirmed");
      }

      // Update profile status in backend
      await apiFetch("/api/profiles/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: myProfile.name,
          age: 28,
          bio: "Passionate about Web3 and security.",
          verifiedDna: true,
          reputationScore: myProfile.reputationScore,
          voters: myProfile.voters,
          dnaProfile: profile,
          dnaHash: dnaHash,
        }),
      });

      setDnaProfile(profile);
      setIsDnaVerified(true);
      setMyProfile((prev) => ({
        ...prev,
        dnaProfile: profile,
        isDnaVerified: true,
      }));
    } catch (e: any) {
      console.error("DNA verification failed", e);
      setDnaVerificationError(e.message || "Failed to verify DNA on blockchain.");
      setIsDnaVerified(false);
    } finally {
      setIsDnaVerifying(false);
    }
  };

  const revokeDNA = async () => {
    if (!walletClient || !publicClient || !wagmiAddress || !myProfile.id) {
      setDnaVerificationError("Wallet not connected or profile not loaded.");
      return;
    }

    setIsDnaRevoking(true);
    setDnaVerificationError(null);

    try {
      // On-chain revokeDNA is owner-gated: the backend relays it with the
      // admin key, then we confirm the flag actually flipped on-chain.
      const relayRes = await apiFetch("/api/verification/dna/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const relayData = await relayRes.json();
      if (!relayRes.ok || !relayData.success) {
        throw new Error(relayData.error || "DNA revocation request failed");
      }

      const revokedOnChain = !(await publicClient.readContract({
        address: DNA_VERIFICATION_ADDRESS,
        abi: DNAVerificationABI,
        functionName: "isDNAVerified",
        args: [wagmiAddress as `0x${string}`],
      })) as boolean;
      if (!revokedOnChain) {
        throw new Error("On-chain DNA revocation was not confirmed");
      }

      // Update profile status in backend
      await apiFetch("/api/profiles/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: myProfile.name,
          age: 28,
          bio: "Passionate about Web3 and security.",
          verifiedDna: false,
          reputationScore: myProfile.reputationScore,
          voters: myProfile.voters,
          dnaProfile: null,
          dnaHash: null,
        }),
      });

      setDnaProfile(null);
      setIsDnaVerified(false);
      setMyProfile((prev) => ({
        ...prev,
        dnaProfile: null,
        isDnaVerified: false,
      }));
    } catch (e: any) {
      console.error("DNA revocation failed", e);
      setDnaVerificationError(e.message || "Failed to revoke DNA on blockchain.");
    } finally {
      setIsDnaRevoking(false);
    }
  };

  const addMessage = async (
    profileId: string,
    text: string,
    sender: "me" | "them" = "me",
    isRequest?: boolean,
    requestType?: "STD" | "DNA" | "PHOTO" | "LIVENESS",
    photoGrantKind?: "temporary" | "permanent",
    photoAction?: "approve" | "deny" | "offer",
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
          photoGrantKind,
          photoAction,
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
                  photoGrantKind,
                  photoAction,
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

  const loadChatHistory = async (profileId: string) => {
    if (!myProfile.id) return;
    try {
      const msgRes = await apiFetch(
        `/api/messages?senderId=${myProfile.id}&receiverId=${profileId}`,
      );
      const msgData = await msgRes.json();
      const rawMsgs = Array.isArray(msgData) ? msgData : [];
      const chatHistory: ChatMessage[] = rawMsgs.map((m: any) => ({
        id: m.id,
        sender: m.senderId === myProfile.id ? "me" : "them",
        text: m.text,
        time: m.time,
        isRequest: m.isRequest,
        requestType: m.requestType,
        requestStatus: m.requestStatus,
        photoGrantKind: m.photoGrantKind,
        photoAction: m.photoAction,
      }));

      setProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, chatHistory, hasChat: true } : p)),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const requestAccess = async (profileId: string, testType: "STD" | "DNA", t: any) => {
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

      await addMessage(profileId, t("chat.requestAccess", { testType }), "me", true, testType);
    } catch (e) {
      console.error(e);
    }
  };

  const approveAccess = async (profileId: string, testType: "STD" | "DNA", t: any) => {
    if (!myProfile.id) return;
    const profile = profiles.find((p) => p.id === profileId);
    if (!profile) return;

    const isStd = testType === "STD";
    const updatedPermissions = {
      ...profile.accessPermissions,
      myStdApprovedToThem: isStd ? true : profile.accessPermissions.myStdApprovedToThem,
      myDnaApprovedToThem: !isStd ? true : profile.accessPermissions.myDnaApprovedToThem,
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

  const denyAccess = async (profileId: string, testType: "STD" | "DNA", t: any) => {
    if (!myProfile.id) return;
    await addMessage(profileId, t("chat.declinedResponse", { testType }), "me");
  };

  const toggleHideProfile = () => {
    setMyProfile((prev) => ({
      ...prev,
      hideProfileFromLowerLevels: !prev.hideProfileFromLowerLevels,
    }));
  };

  /**
   * Persists my profile fields (used by onboarding + settings edits).
   * Fields are saved with their current values; pass only what changed.
   */
  const persistProfile = async (patch: ProfilePatch) => {
    if (!myProfile.id) return;
    try {
      // Pull any flattened search-detail fields (height, weight, eyeColor, …)
      // off the patch and merge them into the nested searchDetails object.
      const {
        searchDetails: nestedSearchDetails,
        height,
        weight,
        skinColor,
        eyeColor,
        hairColor,
        bodyType,
        education,
        maritalStatus,
        children,
        smoking,
        drinking,
        religion,
        zodiac,
        country,
        city,
        canTravel,
        canTravelCountries,
        kind,
        gender,
        lookingFor,
      } = patch;
      const mergedSearchDetails = {
        ...(myProfile.searchDetails || {}),
        ...nestedSearchDetails,
        ...(height !== undefined ? { height } : {}),
        ...(weight !== undefined ? { weight } : {}),
        ...(skinColor !== undefined ? { skinColor } : {}),
        ...(eyeColor !== undefined ? { eyeColor } : {}),
        ...(hairColor !== undefined ? { hairColor } : {}),
        ...(bodyType !== undefined ? { bodyType } : {}),
        ...(education !== undefined ? { education } : {}),
        ...(maritalStatus !== undefined ? { maritalStatus } : {}),
        ...(children !== undefined ? { children } : {}),
        ...(smoking !== undefined ? { smoking } : {}),
        ...(drinking !== undefined ? { drinking } : {}),
        ...(religion !== undefined ? { religion } : {}),
        ...(zodiac !== undefined ? { zodiac } : {}),
        ...(country !== undefined ? { country } : {}),
        ...(city !== undefined ? { city } : {}),
        ...(canTravel !== undefined ? { canTravel } : {}),
        ...(canTravelCountries !== undefined ? { canTravelCountries } : {}),
        ...(kind !== undefined ? { kind } : {}),
        ...(gender !== undefined ? { gender } : {}),
        ...(lookingFor !== undefined ? { lookingFor } : {}),
      };
      await apiFetch("/api/profiles/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: myProfile.name,
          age: patch.age ?? myProfile.age,
          ageHidden: patch.ageHidden ?? myProfile.ageHidden,
          bio: patch.bio ?? myProfile.bio,
          imageUrl: patch.imageUrl ?? myProfile.imageUrl ?? "",
          languages: patch.languages ?? myProfile.languages,
          photoBlurred: patch.photoBlurred ?? myProfile.photoBlurred,
          photoGrants: patch.photoGrants ?? myProfile.photoGrants,
          onboardingComplete: patch.onboardingComplete ?? myProfile.onboardingComplete,
          faceVerified: patch.faceVerified ?? myProfile.faceVerified,
          faceHash: patch.faceHash ?? myProfile.faceHash,
          lastLivenessCheck: patch.lastLivenessCheck ?? myProfile.lastLivenessCheck,
          verifiedStd: myProfile.stdUploaded,
          verifiedDna: myProfile.isDnaVerified,
          reputationScore: myProfile.reputationScore,
          voters: myProfile.voters,
          searchDetails: mergedSearchDetails,
        }),
      });
      setMyProfile((prev) => ({
        ...prev,
        age: patch.age ?? prev.age,
        ageHidden: patch.ageHidden ?? prev.ageHidden,
        bio: patch.bio ?? prev.bio,
        imageUrl: patch.imageUrl ?? prev.imageUrl,
        languages: patch.languages ?? prev.languages,
        photoBlurred: patch.photoBlurred ?? prev.photoBlurred,
        photoGrants: patch.photoGrants ?? prev.photoGrants,
        onboardingComplete: patch.onboardingComplete ?? prev.onboardingComplete,
        faceVerified: patch.faceVerified ?? prev.faceVerified,
        faceHash: patch.faceHash ?? prev.faceHash,
        lastLivenessCheck: patch.lastLivenessCheck ?? prev.lastLivenessCheck,
        searchDetails: mergedSearchDetails,
      }));
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  };

  const saveProfile = async (patch: ProfilePatch) => {
    await persistProfile(patch);
  };

  const completeOnboarding = async (patch: ProfilePatch) => {
    await persistProfile({ ...patch, onboardingComplete: true });
  };

  /** Marks the onboarding as skipped without touching other fields. */
  const skipOnboarding = async () => {
    await persistProfile({ onboardingComplete: true });
  };

  const requestPhotoAccess = async (profileId: string, t: any) => {
    await addMessage(profileId, t("chat.requestPhoto", {}), "me", true, "PHOTO");
  };

  const approvePhotoAccess = async (profileId: string, kind: PhotoGrantKind, t: any) => {
    const nextGrants = grantPhotoAccess(myProfile.photoGrants, profileId, kind);
    await persistProfile({ photoGrants: nextGrants });
    await addMessage(
      profileId,
      kind === "permanent"
        ? t("chat.photoApprovedPermanent", {})
        : t("chat.photoApprovedTemporary", {}),
      "me",
      false,
      "PHOTO",
      kind,
      "approve",
    );
  };

  const denyPhotoAccess = async (profileId: string, t: any) => {
    await addMessage(profileId, t("chat.photoDenied", {}), "me", false, "PHOTO", undefined, "deny");
  };

  const offerPhotoAccess = async (profileId: string, kind: PhotoGrantKind, t: any) => {
    const nextGrants = grantPhotoAccess(myProfile.photoGrants, profileId, kind);
    await persistProfile({ photoGrants: nextGrants });
    await addMessage(
      profileId,
      kind === "permanent" ? t("chat.photoOfferPermanent", {}) : t("chat.photoOfferTemporary", {}),
      "me",
      false,
      "PHOTO",
      kind,
      "offer",
    );
  };

  const revokePhotoAccess = async (profileId: string, t: any) => {
    const nextGrants = revokeGrant(myProfile.photoGrants, profileId);
    await persistProfile({ photoGrants: nextGrants });
    await addMessage(profileId, t("chat.photoRevoked"), "me");
  };

  const canViewTheirPhoto = (profile: ProfileData): boolean => canViewPhoto(profile, myProfile.id);

  const theirPhotoRemainingMs = (profile: ProfileData): number =>
    temporaryRemainingMs(profile, myProfile.id);

  const myPhotoGrantFor = (profileId: string): PhotoGrant | undefined =>
    myProfile.photoGrants?.[profileId];

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
        loadChatHistory,
        checkCompatibility,
        saveProfile,
        completeOnboarding,
        requestPhotoAccess,
        approvePhotoAccess,
        denyPhotoAccess,
        offerPhotoAccess,
        revokePhotoAccess,
        canViewTheirPhoto,
        theirPhotoRemainingMs,
        myPhotoGrantFor,

        isAuthenticated,
        isConnected,
        address,
        loading,
        signInWithEthereum,
        loginWithEmail,
        registerWithEmail,
        logout,

        authMode,
        setAuthMode,

        searchMode,
        setSearchMode,

        userLocation,
        setUserLocation,

        dnaProfile,
        isDnaVerified,
        isDnaVerifying,
        isDnaRevoking,
        dnaVerificationError,
        setDnaVerificationError,
        uploadDNA,
        verifyDNA,
        revokeDNA,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
