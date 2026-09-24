import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import client from "../../api/client";
import { COLORS } from "../../theme";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/api/orders/mine").then(({ data }) => setOrders(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.screenBg }]}>
        <ActivityIndicator size="large" color={COLORS.customer} />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: COLORS.screenBg }}
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={styles.empty}>No orders yet.</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.vendor}>{item.vendor?.businessName}</Text>
          <Text style={styles.address}>📍 {item.deliveryAddress}</Text>
          <Text style={styles.status}>{item.status.replace("_", " ")}</Text>
          {item.deliveryBoy && (
            <Text style={styles.rider}>🛵 Rider: {item.deliveryBoy.user?.name}</Text>
          )}
          <Text style={styles.total}>₹{item.total}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", color: COLORS.muted, marginTop: 40 },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 12 },
  vendor: { fontWeight: "700" },
  address: { color: "#555", marginTop: 6, fontSize: 13 },
  status: { color: COLORS.customer, marginTop: 6, textTransform: "capitalize", fontWeight: "600" },
  rider: { color: "#555", marginTop: 4, fontSize: 13 },
  total: { marginTop: 4, fontWeight: "600" },
});
