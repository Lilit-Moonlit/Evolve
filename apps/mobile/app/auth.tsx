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

type AuthView = "landing" | "email" | "phone" | "otp";

export default function AuthScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { loginWithEmail, registerWithEmail, requestPhoneOtp, verifyPhoneOtp } =
    useAuth();

  const [view, setView] = useState<AuthView>("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    } catch (err: any) {
      setError(err.message || "Authentication failed");
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
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
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
    } catch (err: any) {
      setError(err.message || "OTP verification failed");
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
            onPress={() => Alert.alert("Wallet", "Coming soon")}
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
            <Text style={styles.backText}>← Back</Text>
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
            <Text style={styles.backText}>← Back</Text>
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
            <Text style={styles.backText}>← Back</Text>
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
});
