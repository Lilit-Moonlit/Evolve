import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../i18n/config";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LanguageOption {
  code: string;
  name: string;
}

const languageOptions: LanguageOption[] = [
  { code: "en", name: "English" },
  { code: "uk", name: "Українська" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "hi", name: "हिन्दी" },
  { code: "tr", name: "Türkçe" },
  { code: "th", name: "ไทย" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "ru", name: "Русский" },
  { code: "bg", name: "Български" },
  { code: "cs", name: "Čeština" },
  { code: "da", name: "Dansk" },
  { code: "el", name: "Ελληνικά" },
  { code: "et", name: "Eesti" },
  { code: "fi", name: "Suomi" },
  { code: "hu", name: "Magyar" },
  { code: "ga", name: "Gaeilge" },
  { code: "it", name: "Italiano" },
  { code: "lt", name: "Lietuvių" },
  { code: "lv", name: "Latviešu" },
  { code: "mt", name: "Malti" },
  { code: "nl", name: "Nederlands" },
  { code: "pl", name: "Polski" },
  { code: "ro", name: "Română" },
  { code: "sk", name: "Slovenčina" },
  { code: "sl", name: "Slovenščina" },
  { code: "sv", name: "Svenska" },
];

export default function LanguageSelector() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const loadSavedLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("evolve-language");
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
      }
    };
    loadSavedLanguage();
  }, []);

  const handleLanguageChange = async (lang: string) => {
    await changeLanguage(lang);
    setCurrentLanguage(lang);
    // UI should update automatically via i18n changeLanguage
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("language.title")}</Text>
        <View style={{ width: 20 }} />
      </View>
      <ScrollView style={styles.content}>
        {languageOptions.map((option) => (
          <TouchableOpacity
            key={option.code}
            style={styles.languageItem}
            onPress={() => handleLanguageChange(option.code)}
          >
            <Text style={styles.languageText}>{option.name}</Text>
            {currentLanguage === option.code && (
              <Text style={styles.selectedIndicator}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    fontSize: 24,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  languageText: {
    fontSize: 16,
  },
  selectedIndicator: {
    fontSize: 18,
    color: "#007AFF",
  },
});
