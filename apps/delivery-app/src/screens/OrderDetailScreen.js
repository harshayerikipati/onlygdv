import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import client from "../api/client";

const NEXT_STATUS = {
  READY: "PICKED_UP",
  PICKED_UP: "DELIVERED",
};

export default function OrderDetailScreen({ route, navigation }) {
  const [order, setOrder] = useState(route.params.order);

  async function advance() {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    const { data } = await client.put(`/api/orders/${order.id}/status`, { status: next });
    setOrder(data);
    if (next === "DELIVERED") navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.vendor}>Pick up from: {order.vendor?.businessName}</Text>
      <Text style={styles.status}>Status: {order.status.replace("_", " ")}</Text>
      <Text style={styles.total}>Order total: ₹{order.total}</Text>
      <Text style={styles.payment}>Payment: {order.paymentMethod}</Text>

      {NEXT_STATUS[order.status] && (
        <TouchableOpacity style={styles.button} onPress={advance}>
          <Text style={styles.buttonText}>
            Mark as {NEXT_STATUS[order.status].replace("_", " ")}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.hint}>
        A "confirm with OTP / photo proof" step can be added here before marking Delivered.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  vendor: { fontSize: 18, fontWeight: "700" },
  status: { color: "#c9540c", marginTop: 8, textTransform: "capitalize" },
  total: { marginTop: 8, fontWeight: "600" },
  payment: { marginTop: 4, color: "#666" },
  button: { backgroundColor: "#c9540c", padding: 14, borderRadius: 8, marginTop: 24 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  hint: { marginTop: 20, fontSize: 12, color: "#999" },
});
