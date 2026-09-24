import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import client from "../../api/client";
import { COLORS } from "../../theme";

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
      style={{ backgroundColor: COLORS.screenBg }}
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={styles.empty}>No orders yet.</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.customer}>{item.customer?.name} · {item.customer?.phone}</Text>
          <Text style={styles.address}>📍 {item.deliveryAddress || "No address given"}</Text>
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
  empty: { textAlign: "center", color: COLORS.muted, marginTop: 40 },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 12 },
  customer: { fontWeight: "700" },
  address: { color: "#555", marginTop: 6, fontSize: 13 },
  status: { color: COLORS.vendor, marginTop: 6, textTransform: "capitalize", fontWeight: "600" },
  total: { marginTop: 4, fontWeight: "600" },
  button: { backgroundColor: COLORS.vendor, padding: 10, borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600", fontSize: 13 },
});
