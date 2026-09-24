import { useState } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { COLORS, roleColor } from "../theme";

const ROLE_META = {
  CUSTOMER: { label: "Customer", emoji: "🛍️" },
  VENDOR: { label: "Vendor", emoji: "🏪" },
  DELIVERY: { label: "Delivery Rider", emoji: "🛵" },
};

export default function LoginScreen({ route, navigation }) {
  const { role } = route.params;
  const meta = ROLE_META[role];
  const color = roleColor(role);
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!phone || !password) {
      Alert.alert("Oops", "Pop in your phone and password first 👀");
      return;
    }
    setLoading(true);
    try {
      const { data } = await client.post("/api/auth/login", { phone, password });
      if (data.user.role !== role) {
        Alert.alert(
          "Wrong tab bestie",
          `This account is a ${data.user.role.toLowerCase()}, not a ${role.toLowerCase()}. Go back and pick the right one.`
        );
        return;
      }
      await login(data.token, data.user);
    } catch (err) {
      Alert.alert("Login failed", err.response?.data?.error || "Check your credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={[COLORS.bgGradientTop, COLORS.bgGradientBottom]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Text style={styles.emoji}>{meta.emoji}</Text>
        <Text style={[styles.title, { color }]}>{meta.label} Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor={COLORS.muted}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "logging in..." : "Log In"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup", { role })}>
          <Text style={[styles.link, { color }]}>new here? create an account →</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("RoleSelect")}>
          <Text style={styles.back}>← pick a different role</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  emoji: { fontSize: 44, textAlign: "center", marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 28 },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
  },
  button: { padding: 15, borderRadius: 14, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 15 },
  link: { textAlign: "center", marginTop: 22, fontWeight: "700" },
  back: { textAlign: "center", marginTop: 16, color: COLORS.muted },
});
