import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

const ROLE_META = {
  CUSTOMER: { label: "Customer", color: "#1a7f37" },
  VENDOR: { label: "Vendor", color: "#1a4d7f" },
  DELIVERY: { label: "Delivery Rider", color: "#c9540c" },
};

export default function LoginScreen({ route, navigation }) {
  const { role } = route.params;
  const meta = ROLE_META[role];
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!phone || !password) {
      Alert.alert("Missing info", "Enter your phone and password.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await client.post("/api/auth/login", { phone, password });
      if (data.user.role !== role) {
        Alert.alert(
          "Wrong account type",
          `This account is registered as ${data.user.role.toLowerCase()}, not ${role.toLowerCase()}. Go back and pick the right option.`
        );
        return;
      }
      await login(data.token, data.user);
      // No manual navigation needed — AuthContext change re-renders the root
      // navigator straight into the correct role's screens.
    } catch (err) {
      Alert.alert("Login failed", err.response?.data?.error || "Check your credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: meta.color }]}>{meta.label} Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: meta.color }]} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Log In"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup", { role })}>
        <Text style={[styles.link, { color: meta.color }]}>New here? Create an account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("RoleSelect")}>
        <Text style={styles.back}>← Choose a different role</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 28 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { padding: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  link: { textAlign: "center", marginTop: 20, fontWeight: "600" },
  back: { textAlign: "center", marginTop: 16, color: "#999" },
});
