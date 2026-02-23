import { StyleSheet, Text, View } from "react-native";
import { CHATBOT_QA } from "../constants/lang";
import { useLanguage } from "../context/LanguageContext";

export default function Chatbot() {
  const { lang } = useLanguage();
  const qaList = CHATBOT_QA[lang];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farmer Help 🤖</Text>

      {qaList.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.question}>{item.q}</Text>
          <Text style={styles.answer}>{item.a}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F8E9",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
  answer: {
    marginTop: 5,
    fontSize: 14,
    color: "#444",
  },
});
