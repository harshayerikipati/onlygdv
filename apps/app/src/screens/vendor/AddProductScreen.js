import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import client from "../../api/client";
import { COLORS } from "../../theme";

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [saving, setSaving] = useState(false);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to add a product picture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
    }
  }

  async function handleSubmit() {
    if (!name || !price) {
      Alert.alert("Missing info", "Add at least a name and price.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name,
        price: parseFloat(price),
        stock: parseInt(stock || "0", 10),
        description,
      };
      // Stored as a data URI directly in the DB — no external image host needed for now.
      if (imageBase64) {
        payload.imageUrl = `data:image/jpeg;base64,${imageBase64}`;
      }
      await client.post("/api/products", payload);
      Alert.alert("Product added! 🎉");
      navigation.navigate("Products");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Could not add product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: COLORS.screenBg }} contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>📷 Add product photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Product name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Price" keyboardType="decimal-pad" value={price} onChangeText={setPrice} />
      <TextInput style={styles.input} placeholder="Stock quantity" keyboardType="number-pad" value={stock} onChangeText={setStock} />
      <TextInput style={[styles.input, { height: 90 }]} placeholder="Description" multiline value={description} onChangeText={setDescription} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? "Saving..." : "Save Product"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  imagePicker: { marginBottom: 16 },
  imagePreview: { width: "100%", height: 180, borderRadius: 14 },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: { color: COLORS.muted, fontWeight: "600" },
  input: { backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 12 },
  button: { backgroundColor: COLORS.vendor, padding: 15, borderRadius: 12, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
