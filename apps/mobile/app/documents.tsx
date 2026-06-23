import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function Documents() {
  const router = useRouter();
  const { t } = useTranslation();

  // Mock documents for now
  const documents = [
    { id: "1", name: "STD Test Results.pdf", uploadedAt: "2023-01-15" },
    { id: "2", name: "DNA Analysis.pdf", uploadedAt: "2023-03-01" },
  ];

  const handleUploadDocument = () => {
    // Implement document upload logic here
    console.log("Upload document");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("profile.documents.title")}</Text>
        <View style={{ width: 20 }} />
      </View>
      <ScrollView style={styles.content}>
        {documents.length > 0 ? (
          documents.map((doc) => (
            <View key={doc.id} style={styles.documentItem}>
              <Text style={styles.documentName}>{doc.name}</Text>
              <Text style={styles.documentDate}>
                Uploaded: {doc.uploadedAt}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDocumentsText}>
            {t("profile.documents.noDocuments")}
          </Text>
        )}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadDocument}
        >
          <Text style={styles.uploadButtonText}>Upload New Document</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  documentItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  documentName: {
    fontSize: 16,
    fontWeight: "600",
  },
  documentDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  noDocumentsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  uploadButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
