import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../store/AuthContext";

import { useSignMessage, useConnect } from "wagmi";
import { useAccount } from "wagmi";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthView = "landing" | "email" | "phone" | "otp" | "wallet";

export default function AuthScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    loginWithEmail,
    registerWithEmail,
    requestPhoneOtp,
    verifyPhoneOtp,
    signInWithEthereum,
    verifyWallet,
  } = useAuth();

  const { connect, connectors } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { address, isConnected } = useAccount();

  const [view, setView] = useState<AuthView>("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  const handleEmailSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      router.replace("/home");
    } catch {
      setError(t("auth.error.failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await requestPhoneOtp(phoneNumber);
      setOtpSent(true);
      setView("otp");
    } catch {
      setError(t("auth.phone.error.sendFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await verifyPhoneOtp(phoneNumber, otp);
      router.replace("/home");
    } catch {
      setError(t("auth.phone.error.verifyFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (view === "landing") {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{t("auth.landing.title")}</Text>
          <Text style={styles.subtitle}>{t("app.tagline")}</Text>

          <TouchableOpacity
            style={styles.authButton}
            onPress={() => setView("email")}
          >
            <Text style={styles.authButtonText}>{t("auth.landing.email")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.authButton}
            onPress={() => setView("phone")}
          >
            <Text style={styles.authButtonText}>{t("auth.landing.phone")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authButton, styles.walletButton]}
            onPress={() => setView("wallet")}
          >
            <Text style={styles.authButtonText}>
              {t("auth.landing.wallet")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (view === "email") {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => setView("landing")}>
            <Text style={styles.backText}>{t("common.back")}</Text>
          </TouchableOpacity>

          <Text style={styles.formTitle}>{t("auth.email.title")}</Text>
          <Text style={styles.formDescription}>
            {t("auth.email.description")}
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder={t("auth.email.email")}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder={t("auth.email.password")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleEmailSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isRegistering
                  ? t("auth.email.register")
                  : t("auth.email.login")}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
            <Text style={styles.switchText}>
              {isRegistering
                ? t("auth.email.switchToLogin")
                : t("auth.email.switchToRegister")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (view === "phone") {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => setView("landing")}>
            <Text style={styles.backText}>{t("common.back")}</Text>
          </TouchableOpacity>

          <Text style={styles.formTitle}>{t("auth.phone.title")}</Text>
          <Text style={styles.formDescription}>
            {t("auth.phone.description")}
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder={t("auth.phone.phonePlaceholder")}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleRequestOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {t("auth.phone.getCode")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (view === "otp") {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => setView("phone")}>
            <Text style={styles.backText}>{t("common.back")}</Text>
          </TouchableOpacity>

          <Text style={styles.formTitle}>{t("auth.phone.title")}</Text>
          <Text style={styles.formDescription}>
            {t("auth.phone.otpSent", { phone: phoneNumber })}
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder={t("auth.phone.otpPlaceholder")}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {t("auth.phone.verify")}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRequestOtp}>
            <Text style={styles.switchText}>{t("auth.phone.resendCode")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (view === "wallet") {
    const handleSignIn = async () => {
      if (!isConnected || !address) {
        connect({ connector: connectors[0] });
        return;
      }
      try {
        setLoading(true);
        await signInWithEthereum(address);
        const nonce = await AsyncStorage.getItem("evolve_siwe_nonce");
        if (!nonce) throw new Error(t("auth.signIn.errors.missingNonce"));
        const message = `${t("auth.signIn.statement")} Nonce: ${nonce}`;
        const signature = await signMessageAsync({ message });
        await verifyWallet(address, signature, message);
        setSignedIn(true);
        router.replace("/home");
      } catch {
        setError(t("auth.error.failed"));
      } finally {
        setLoading(false);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => setView("landing")}>
            <Text style={styles.backText}>{t("common.back")}</Text>
          </TouchableOpacity>

          <Text style={styles.formTitle}>{t("auth.signIn.title")}</Text>
          <Text style={styles.formDescription}>
            {t("auth.signIn.description")}
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {!isConnected ? (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => connect({ connector: connectors[0] })}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {t("auth.connectWallet.connectButton")}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={styles.infoText}>
                {t("profile.wallet.address")}: {address?.slice(0, 6)}...
                {address?.slice(-4)}
              </Text>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {t("auth.signIn.button")}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  authButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  walletButton: {
    backgroundColor: "#34C759",
  },
  authButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  backText: {
    fontSize: 16,
    color: "#007AFF",
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  formDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  switchText: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 14,
  },
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
});
