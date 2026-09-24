import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import client from "../../api/client";
import { COLORS } from "../../theme";

const NEXT_STATUS = { READY: "PICKED_UP", PICKED_UP: "DELIVERED" };

export default function OrderDetailScreen({ route, navigation }) {
  const [order, setOrder] = useState(route.params.order);

  async function advance() {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    const { data } = await client.put(`/api/orders/${order.id}/status`, { status: next });
    setOrder(data);
    if (next === "DELIVERED") navigation.goBack();
  }

  function callCustomer() {
    if (order.customerPhone || order.customer?.phone) {
      Linking.openURL(`tel:${order.customerPhone || order.customer.phone}`);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: COLORS.screenBg }]}>
      <View style={styles.card}>
        <Text style={styles.label}>🏪 Pickup from</Text>
        <Text style={styles.value}>{order.vendor?.businessName}</Text>
        {order.vendor?.address ? <Text style={styles.sub}>{order.vendor.address}</Text> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📍 Deliver to</Text>
        <Text style={styles.value}>{order.deliveryAddress}</Text>
        <Text style={styles.sub}>{order.customer?.name}</Text>
        {(order.customerPhone || order.customer?.phone) && (
          <TouchableOpacity onPress={callCustomer}>
            <Text style={styles.callLink}>📞 Call customer</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.status}>Status: {order.status.replace("_", " ")}</Text>
        <Text style={styles.value}>Order total: ₹{order.total}</Text>
        <Text style={styles.sub}>Payment: {order.paymentMethod}</Text>
      </View>

      {NEXT_STATUS[order.status] && (
        <TouchableOpacity style={styles.button} onPress={advance}>
          <Text style={styles.buttonText}>Mark as {NEXT_STATUS[order.status].replace("_", " ")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 12 },
  label: { fontSize: 12, color: COLORS.muted, fontWeight: "700", marginBottom: 4 },
  value: { fontSize: 16, fontWeight: "700" },
  sub: { color: "#666", marginTop: 4 },
  callLink: { color: COLORS.delivery, marginTop: 8, fontWeight: "600" },
  status: { color: COLORS.delivery, fontWeight: "700", textTransform: "capitalize", marginBottom: 6 },
  button: { backgroundColor: COLORS.delivery, padding: 15, borderRadius: 12, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
