import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import client from "../../api/client";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/api/orders/mine").then(({ data }) => setOrders(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a7f37" />
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={styles.empty}>No orders yet.</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.vendor}>{item.vendor?.businessName}</Text>
          <Text style={styles.status}>{item.status.replace("_", " ")}</Text>
          <Text style={styles.total}>₹{item.total}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
  card: { backgroundColor: "#f8f8f8", borderRadius: 10, padding: 14, marginBottom: 12 },
  vendor: { fontWeight: "700" },
  status: { color: "#1a7f37", marginTop: 4, textTransform: "capitalize" },
  total: { marginTop: 4, fontWeight: "600" },
});
