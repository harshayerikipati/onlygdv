import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import client from "../../api/client";

const NEXT_STATUS = { PLACED: "ACCEPTED", ACCEPTED: "PREPARING", PREPARING: "READY" };

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);

  function load() {
    client.get("/api/orders/vendor").then(({ data }) => setOrders(data));
  }
  useEffect(load, []);

  async function advance(order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    await client.put(`/api/orders/${order.id}/status`, { status: next });
    load();
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={styles.empty}>No orders yet.</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.customer}>{item.customer?.name} · {item.customer?.phone}</Text>
          <Text style={styles.status}>{item.status.replace("_", " ")}</Text>
          <Text style={styles.total}>₹{item.total}</Text>
          {NEXT_STATUS[item.status] && (
            <TouchableOpacity style={styles.button} onPress={() => advance(item)}>
              <Text style={styles.buttonText}>Mark as {NEXT_STATUS[item.status].replace("_", " ")}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
  card: { backgroundColor: "#f8f8f8", borderRadius: 10, padding: 14, marginBottom: 12 },
  customer: { fontWeight: "700" },
  status: { color: "#1a4d7f", marginTop: 4, textTransform: "capitalize" },
  total: { marginTop: 4, fontWeight: "600" },
  button: { backgroundColor: "#1a4d7f", padding: 10, borderRadius: 8, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600", fontSize: 13 },
});
