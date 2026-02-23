import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useLanguage } from "../context/LanguageContext";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function Chat() {
  const { lang } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // You can later make these dynamic
  const selectedCrop = "tomato";
  const detectedDisease = "early blight";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://192.168.29.244:5001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          crop: selectedCrop,
          disease: detectedDisease,
          lang: lang, // "en" or "hi"
        }),
      });

      const data = await response.json();

      const botMessage: Message = {
        role: "bot",
        text: data.reply || "No response received",
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          text:
            lang === "hi"
              ? "❌ सर्वर से कनेक्ट नहीं हो पाया"
              : "❌ Unable to connect to server",
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🤖 {lang === "hi" ? "किसान सहायक" : "Farmer Assistant"}
      </Text>

      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 10 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.role === "user" ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={
            lang === "hi"
              ? "अपना सवाल लिखें..."
              : "Ask your question..."
          }
          value={input}
          onChangeText={setInput}
        />

        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>➤</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F8E9",
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: "85%",
  },
  userBubble: {
    backgroundColor: "#C8E6C9",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 15,
    color: "#000",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  sendButton: {
    backgroundColor: "#2E7D32",
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sendText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
