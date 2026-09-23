import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

const ROLE_META = {
  CUSTOMER: { label: "Customer", color: "#1a7f37" },
  VENDOR: { label: "Vendor", color: "#1a4d7f" },
  DELIVERY: { label: "Delivery Rider", color: "#c9540c" },
};

const VENDOR_TYPES = ["SHOP", "RESTAURANT", "GROCERY"];

export default function SignupScreen({ route, navigation }) {
  const { role } = route.params;
  const meta = ROLE_META[role];
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [vendorType, setVendorType] = useState("SHOP");
  const [vehicleType, setVehicleType] = useState("Bike");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name || !phone || password.length < 6) {
      Alert.alert("Missing info", "Fill in your name, phone, and a password of 6+ characters.");
      return;
    }
    if (role === "VENDOR" && !businessName) {
      Alert.alert("Missing info", "Please enter your business name.");
      return;
    }

    setLoading(true);
    try {
      const payload = { name, phone, password, role };
      if (role === "VENDOR") {
        payload.businessName = businessName;
        payload.vendorType = vendorType;
      }
      if (role === "DELIVERY") {
        payload.vehicleType = vehicleType;
      }

      const { data } = await client.post("/api/auth/signup", payload);

      if (role === "VENDOR") {
        Alert.alert(
          "Account created!",
          "Your store is pending admin approval. You'll be able to log in once approved.",
          [{ text: "OK", onPress: () => navigation.replace("Login", { role }) }]
        );
      } else {
        // Customers and delivery riders can go straight in.
        await login(data.token, data.user);
      }
    } catch (err) {
      Alert.alert("Signup failed", err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: meta.color }]}>{meta.label} Sign Up</Text>

      <TextInput style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
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

      {role === "VENDOR" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Business name"
            value={businessName}
            onChangeText={setBusinessName}
          />
          <Text style={styles.label}>Business type</Text>
          <View style={styles.chipRow}>
            {VENDOR_TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, vendorType === t && { backgroundColor: meta.color, borderColor: meta.color }]}
                onPress={() => setVendorType(t)}
              >
                <Text style={[styles.chipText, vendorType === t && styles.chipTextActive]}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {role === "DELIVERY" && (
        <TextInput
          style={styles.input}
          placeholder="Vehicle type (e.g. Bike, Scooter)"
          value={vehicleType}
          onChangeText={setVehicleType}
        />
      )}

      <TouchableOpacity style={[styles.button, { backgroundColor: meta.color }]} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating account..." : "Sign Up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={[styles.link, { color: meta.color }]}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 24 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 12 },
  label: { fontSize: 13, color: "#555", marginBottom: 8 },
  chipRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  chip: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 20, paddingVertical: 8, alignItems: "center" },
  chipText: { fontSize: 12, color: "#555" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  button: { padding: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  link: { textAlign: "center", marginTop: 20, fontWeight: "600" },
});
