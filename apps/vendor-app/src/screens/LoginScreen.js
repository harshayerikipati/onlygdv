import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      const { data } = await client.post("/api/auth/login", { phone, password });
      if (data.user.role !== "VENDOR") {
        Alert.alert("Wrong app", "This account is not registered as a vendor.");
        return;
      }
      await AsyncStorage.setItem("token", data.token);
      navigation.replace("Dashboard");
    } catch (err) {
      Alert.alert("Login failed", err.response?.data?.error || "Check your credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OnlyGDV Vendor</Text>
      <Text style={styles.subtitle}>Manage your shop or restaurant</Text>

      <TextInput style={styles.input} placeholder="Phone number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Log In"}</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        New vendor? Sign up via POST /api/auth/signup with role: "VENDOR", businessName, vendorType.
        Your account needs Admin approval before it goes live.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", color: "#1a4d7f" },
  subtitle: { textAlign: "center", color: "#666", marginBottom: 32 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: "#1a4d7f", padding: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  hint: { marginTop: 24, fontSize: 12, color: "#999", textAlign: "center" },
});
