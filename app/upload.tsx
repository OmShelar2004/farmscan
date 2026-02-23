import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Upload() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedCrop, setSelectedCrop] = useState("tomato");

  // 🔹 CHANGE THIS TO YOUR IP
  const SERVER_URL = "http://192.168.29.244:5001";

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required to access gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Please select an image first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", {
        uri: image,
        name: "leaf.jpg",
        type: "image/jpeg",
      } as any);

      formData.append("crop", selectedCrop);

      const response = await fetch(`${SERVER_URL}/predict`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const text = await response.text();

      // 🔥 Prevent JSON crash if backend sends HTML
      if (text.startsWith("<")) {
        console.log("Server returned HTML error:", text);
        Alert.alert("Server Error. Check backend.");
        setLoading(false);
        return;
      }

      const data = JSON.parse(text);

      if (data.error) {
        Alert.alert("Error", data.error);
        setLoading(false);
        return;
      }

      setResult(data);
      setLoading(false);
    } catch (error) {
      console.log("Upload Error:", error);
      Alert.alert("Cannot connect to server");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Leaf Image 🌿</Text>

      {/* Crop Selection */}
      <View style={styles.cropContainer}>
        <Pressable
          style={[
            styles.cropButton,
            selectedCrop === "tomato" && styles.selectedCrop,
          ]}
          onPress={() => setSelectedCrop("tomato")}
        >
          <Text style={styles.cropText}>Tomato</Text>
        </Pressable>

        <Pressable
          style={[
            styles.cropButton,
            selectedCrop === "potato" && styles.selectedCrop,
          ]}
          onPress={() => setSelectedCrop("potato")}
        >
          <Text style={styles.cropText}>Potato</Text>
        </Pressable>
      </View>

      <Pressable style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Choose Image</Text>
      </Pressable>

      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}

      <Pressable style={styles.button} onPress={uploadImage}>
        <Text style={styles.buttonText}>Analyse</Text>
      </Pressable>

      {loading && <ActivityIndicator size="large" color="#2E7D32" />}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Crop: {result.crop}</Text>
          <Text style={styles.resultText}>
            Disease: {result.disease}
          </Text>
          <Text style={styles.resultText}>
            Confidence:{" "}
            {result.confidence
              ? (result.confidence * 100).toFixed(2) + "%"
              : "0%"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F8E9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: "#2E7D32",
  },
  button: {
    backgroundColor: "#388E3C",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 15,
    borderRadius: 10,
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
  cropContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  cropButton: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: "#A5D6A7",
  },
  selectedCrop: {
    backgroundColor: "#2E7D32",
  },
  cropText: {
    color: "white",
    fontWeight: "600",
  },
});
