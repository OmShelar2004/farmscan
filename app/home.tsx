import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LANGUAGES } from "../constants/lang";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { lang, toggleLang } = useLanguage();
  const t = LANGUAGES[lang];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.welcome} 👨‍🌾</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/upload")}
      >
        <Text style={styles.buttonText}>{t.detect}</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { marginTop: 15, backgroundColor: "#1976D2" }]}
        onPress={() => router.push("/chat")}
      >
        <Text style={styles.buttonText}>🤖 Talk to AI Assistant</Text>
      </Pressable>

      <Pressable style={styles.langButton} onPress={toggleLang}>
        <Text style={styles.langText}>
          {lang === "en" ? "हिंदी" : "English"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F8E9",
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#388E3C",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  langButton: {
    marginTop: 20,
  },
  langText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "600",
  },
});
