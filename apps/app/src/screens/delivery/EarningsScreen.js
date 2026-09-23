import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import client from "../../api/client";

export default function EarningsScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    client.get("/api/delivery/me").then(({ data }) => setOrders(data.orders || []));
  }, []);

  const delivered = orders.filter((o) => o.status === "DELIVERED");
  const perDeliveryEarning = 30;
  const totalEarnings = delivered.length * perDeliveryEarning;

  return (
    <View style={styles.container}>
      <Text style={styles.big}>₹{totalEarnings}</Text>
      <Text style={styles.label}>Total earnings ({delivered.length} deliveries)</Text>
      <Text style={styles.note}>
        Placeholder calculation (₹{perDeliveryEarning}/delivery). Replace with real payout logic later.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: "center", marginTop: 40 },
  big: { fontSize: 40, fontWeight: "800", color: "#c9540c" },
  label: { color: "#666", marginTop: 8 },
  note: { marginTop: 40, color: "#999", fontSize: 12, textAlign: "center", lineHeight: 18 },
});
