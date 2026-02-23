import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Result() {
  const {
    crop,
    disease,
    confidence,
    imageUri,
  } = useLocalSearchParams();

  // ⚠️ Crop mismatch handling
if (disease === "crop_mismatch") {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚠️ Crop Mismatch</Text>
      <Text style={styles.text}>
        The selected crop does not match the detected crop.
      </Text>
      <Text style={styles.text}>
        Detected crop: {crop}
      </Text>

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </Pressable>
    </View>
  );
}


  // 🚫 Invalid image handling
  if (disease === "invalid_image") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>❌ Invalid Image</Text>
        <Text style={styles.text}>
          Please upload a clear image of a single crop leaf.
        </Text>

        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  // ⏳ Model not loaded yet
  if (disease?.includes("not_loaded")) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>⚠️ Model Not Ready</Text>
        <Text style={styles.text}>
          Disease detection model for {crop} is not activated yet.
        </Text>

        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // ✅ Normal result
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analysis Result 🌱</Text>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Crop</Text>
        <Text style={styles.value}>{crop}</Text>

        <Text style={styles.label}>Disease</Text>
        <Text style={styles.value}>{disease}</Text>

        <Text style={styles.label}>Confidence</Text>
        <Text style={styles.value}>
          {(Number(confidence) * 100).toFixed(1)}%
        </Text>
      </View>

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Analyze Another Image</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F8E9",
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#2E7D32",
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B5E20",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
