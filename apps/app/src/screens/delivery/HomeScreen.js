import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Switch, Alert } from "react-native";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { confirmLogout } from "../../utils/confirmLogout";
import { COLORS } from "../../theme";

export default function HomeScreen({ navigation }) {
  const [me, setMe] = useState(null);
  const [available, setAvailable] = useState(false);
  const { logout } = useAuth();

  function load() {
    client.get("/api/delivery/me").then(({ data }) => {
      setMe(data);
      setAvailable(data.isAvailable);
    });
  }
  useEffect(load, []);

  async function toggleAvailable(value) {
    try {
      await client.put("/api/delivery/availability", { isAvailable: value });
      setAvailable(value);
    } catch (err) {
      Alert.alert("Can't go online", err.response?.data?.error || "Try again later");
    }
  }

  const pending = me && me.status !== "APPROVED";

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.screenBg }}>
      {pending && (
        <View style={styles.pendingBanner}>
          <Text style={styles.pendingTitle}>⏳ Verification pending</Text>
          <Text style={styles.pendingText}>
            Your documents are being reviewed by the OnlyGDV team. You'll be able to go online
            and accept deliveries once approved.
          </Text>
        </View>
      )}

      <View style={styles.topBar}>
        <Text style={styles.label}>Online / Accepting orders</Text>
        <Switch value={available} onValueChange={toggleAvailable} disabled={pending} />
      </View>

      <View style={styles.linkRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Earnings")}>
          <Text style={styles.link}>View Earnings →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmLogout(logout)}>
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={me?.orders || []}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No deliveries assigned yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("OrderDetail", { order: item })}>
            <Text style={styles.vendor}>Pickup: {item.vendor?.businessName}</Text>
            <Text style={styles.address}>📍 Drop: {item.deliveryAddress}</Text>
            <Text style={styles.status}>{item.status.replace("_", " ")}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pendingBanner: { backgroundColor: "#FFF3CD", padding: 16, margin: 16, borderRadius: 14 },
  pendingTitle: { fontWeight: "700", color: "#8A6D00", marginBottom: 4 },
  pendingText: { color: "#8A6D00", fontSize: 13, lineHeight: 18 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderColor: COLORS.border },
  label: { fontWeight: "600" },
  linkRow: { flexDirection: "row", justifyContent: "space-between", padding: 16 },
  link: { color: COLORS.delivery, fontWeight: "600" },
  logout: { color: COLORS.muted },
  empty: { textAlign: "center", color: COLORS.muted, marginTop: 40 },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 12 },
  vendor: { fontWeight: "700" },
  address: { color: "#555", marginTop: 6, fontSize: 13 },
  status: { color: COLORS.delivery, marginTop: 6, textTransform: "capitalize", fontWeight: "600" },
});
