import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import client from "../api/client";

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit() {
    try {
      await client.post("/api/products", {
        name,
        price: parseFloat(price),
        stock: parseInt(stock || "0", 10),
        description,
      });
      Alert.alert("Product added");
      navigation.navigate("Products");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Could not add product");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Product name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Price" keyboardType="decimal-pad" value={price} onChangeText={setPrice} />
      <TextInput style={styles.input} placeholder="Stock quantity" keyboardType="number-pad" value={stock} onChangeText={setStock} />
      <TextInput style={[styles.input, { height: 90 }]} placeholder="Description" multiline value={description} onChangeText={setDescription} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: "#1a4d7f", padding: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
