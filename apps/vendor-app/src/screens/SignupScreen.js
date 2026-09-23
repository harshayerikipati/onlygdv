import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";

const VENDOR_TYPES = ["SHOP", "RESTAURANT", "GROCERY"];

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [vendorType, setVendorType] = useState("SHOP");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name || !phone || !password || !businessName) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await client.post("/api/auth/signup", {
        name,
        phone,
        password,
        role: "VENDOR",
        businessName,
        vendorType,
      });
      Alert.alert(
        "Account created!",
        "Your store is pending admin approval. You'll be able to log in once approved.",
        [{ text: "OK", onPress: () => navigation.replace("Login") }]
      );
    } catch (err) {
      Alert.alert("Signup failed", err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Your Store</Text>
      <Text style={styles.subtitle}>Sell on OnlyGDV as a shop or restaurant</Text>

      <TextInput style={styles.input} placeholder="Your name" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min 6 characters)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Business name"
        value={businessName}
        onChangeText={setBusinessName}
      />

      <Text style={styles.label}>Business type</Text>
      <View style={styles.typeRow}>
        {VENDOR_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.typeChip, vendorType === t && styles.typeChipActive]}
            onPress={() => setVendorType(t)}
          >
            <Text style={[styles.typeChipText, vendorType === t && styles.typeChipTextActive]}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating account..." : "Register"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Already registered? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", color: "#1a4d7f" },
  subtitle: { textAlign: "center", color: "#666", marginBottom: 24 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 12 },
  label: { fontSize: 13, color: "#555", marginBottom: 8, marginTop: 4 },
  typeRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  typeChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
  },
  typeChipActive: { backgroundColor: "#1a4d7f", borderColor: "#1a4d7f" },
  typeChipText: { fontSize: 12, color: "#555" },
  typeChipTextActive: { color: "#fff", fontWeight: "600" },
  button: { backgroundColor: "#1a4d7f", padding: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  link: { textAlign: "center", color: "#1a4d7f", marginTop: 20 },
});
