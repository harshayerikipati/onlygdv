import { useState } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { COLORS, roleColor } from "../theme";

const ROLE_META = {
  CUSTOMER: { label: "Customer", emoji: "🛍️" },
  VENDOR: { label: "Vendor", emoji: "🏪" },
  DELIVERY: { label: "Delivery Rider", emoji: "🛵" },
};

const VENDOR_TYPES = ["SHOP", "RESTAURANT", "GROCERY"];

export default function SignupScreen({ route, navigation }) {
  const { role } = route.params;
  const meta = ROLE_META[role];
  const color = roleColor(role);
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [vendorType, setVendorType] = useState("SHOP");
  const [address, setAddress] = useState("");
  const [vehicleType, setVehicleType] = useState("Bike");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name || !phone || password.length < 6) {
      Alert.alert("Hold up", "Fill in your name, phone, and a password of 6+ characters.");
      return;
    }
    if (role === "VENDOR" && !businessName) {
      Alert.alert("Hold up", "What's your business called?");
      return;
    }
    if (role === "DELIVERY" && (!vehicleNumber || !licenseNumber)) {
      Alert.alert("Hold up", "We need your vehicle number and license number to verify you.");
      return;
    }

    setLoading(true);
    try {
      const payload = { name, phone, password, role };
      if (role === "VENDOR") {
        payload.businessName = businessName;
        payload.vendorType = vendorType;
        payload.address = address;
      }
      if (role === "DELIVERY") {
        payload.vehicleType = vehicleType;
        payload.vehicleNumber = vehicleNumber;
        payload.licenseNumber = licenseNumber;
      }

      const { data } = await client.post("/api/auth/signup", payload);

      if (role === "VENDOR") {
        Alert.alert(
          "Account created! 🎉",
          "Your store is pending admin approval. You'll be able to log in once approved.",
          [{ text: "OK", onPress: () => navigation.replace("Login", { role }) }]
        );
      } else if (role === "DELIVERY") {
        Alert.alert(
          "Account created! 🎉",
          "Your documents are pending verification by the admin team. You'll be able to go online once approved — you can log in now to check your status.",
          [{ text: "OK", onPress: () => navigation.replace("Login", { role }) }]
        );
      } else {
        await login(data.token, data.user);
      }
    } catch (err) {
      Alert.alert("Signup failed", err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={[COLORS.bgGradientTop, COLORS.bgGradientBottom]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.emoji}>{meta.emoji}</Text>
        <Text style={[styles.title, { color }]}>{meta.label} Sign Up</Text>

        <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={COLORS.muted} value={name} onChangeText={setName} />
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
          placeholder="Password (min 6 characters)"
          placeholderTextColor={COLORS.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {role === "VENDOR" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Business name"
              placeholderTextColor={COLORS.muted}
              value={businessName}
              onChangeText={setBusinessName}
            />
            <Text style={styles.label}>business type</Text>
            <TextInputChipsRow value={vendorType} onChange={setVendorType} color={color} />
            <TextInput
              style={styles.input}
              placeholder="Shop / restaurant address"
              placeholderTextColor={COLORS.muted}
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </>
        )}

        {role === "DELIVERY" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Vehicle type (e.g. Bike, Scooter)"
              placeholderTextColor={COLORS.muted}
              value={vehicleType}
              onChangeText={setVehicleType}
            />
            <TextInput
              style={styles.input}
              placeholder="Vehicle number (e.g. TS09AB1234)"
              placeholderTextColor={COLORS.muted}
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              autoCapitalize="characters"
            />
            <TextInput
              style={styles.input}
              placeholder="Driving license number"
              placeholderTextColor={COLORS.muted}
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              autoCapitalize="characters"
            />
            <Text style={styles.hint}>
              We verify these details before you can start accepting deliveries — this keeps
              customers and vendors safe.
            </Text>
          </>
        )}

        <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={handleSignup} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "creating account..." : "Sign Up"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.link, { color }]}>already have an account? log in</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

function TextInputChipsRow({ value, onChange, color }) {
  return (
    <ChipRow>
      {VENDOR_TYPES.map((t) => (
        <TouchableOpacity
          key={t}
          style={[chipStyles.chip, value === t && { backgroundColor: color, borderColor: color }]}
          onPress={() => onChange(t)}
        >
          <Text style={[chipStyles.chipText, value === t && chipStyles.chipTextActive]}>
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </ChipRow>
  );
}

function ChipRow({ children }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} style={chipStyles.row}>{children}</ScrollView>;
}

const chipStyles = StyleSheet.create({
  row: { marginBottom: 16 },
  chip: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 8,
  },
  chipText: { fontSize: 13, color: COLORS.muted, fontWeight: "600" },
  chipTextActive: { color: "#fff" },
});

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 24 },
  emoji: { fontSize: 40, textAlign: "center", marginBottom: 6 },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 22 },
  input: { backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 12, fontSize: 15 },
  label: { fontSize: 13, color: COLORS.muted, marginBottom: 8, fontWeight: "600" },
  button: { padding: 15, borderRadius: 14, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 15 },
  link: { textAlign: "center", marginTop: 22, fontWeight: "700" },
  hint: { fontSize: 12, color: COLORS.muted, marginBottom: 12, lineHeight: 17 },
});
