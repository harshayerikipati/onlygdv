import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Switch } from "react-native";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";

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
    setAvailable(value);
    await client.put("/api/delivery/availability", { isAvailable: value });
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <Text style={styles.label}>Online / Accepting orders</Text>
        <Switch value={available} onValueChange={toggleAvailable} />
      </View>

      <View style={styles.linkRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Earnings")}>
          <Text style={styles.link}>View Earnings →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
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
            <Text style={styles.vendor}>{item.vendor?.businessName}</Text>
            <Text style={styles.status}>{item.status.replace("_", " ")}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderColor: "#eee" },
  label: { fontWeight: "600" },
  linkRow: { flexDirection: "row", justifyContent: "space-between", padding: 16 },
  link: { color: "#c9540c", fontWeight: "600" },
  logout: { color: "#999" },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
  card: { backgroundColor: "#f8f8f8", borderRadius: 10, padding: 14, marginBottom: 12 },
  vendor: { fontWeight: "700" },
  status: { color: "#c9540c", marginTop: 4, textTransform: "capitalize" },
});
