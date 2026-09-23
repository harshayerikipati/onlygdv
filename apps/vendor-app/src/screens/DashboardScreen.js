import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import client from "../api/client";

export default function DashboardScreen({ navigation }) {
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    client.get("/api/vendors/me").then(({ data }) => setVendor(data)).catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{vendor?.businessName || "Your store"}</Text>
      <Text style={styles.status}>Status: {vendor?.status || "..."}</Text>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Products")}>
        <Text style={styles.cardTitle}>My Products</Text>
        <Text style={styles.cardSub}>{vendor?.products?.length ?? 0} items listed</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Orders")}>
        <Text style={styles.cardTitle}>Incoming Orders</Text>
        <Text style={styles.cardSub}>View and update order status</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AddProduct")}>
        <Text style={styles.cardTitle}>+ Add Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  name: { fontSize: 24, fontWeight: "700" },
  status: { color: "#888", marginBottom: 24, textTransform: "capitalize" },
  card: { backgroundColor: "#f2f6fa", borderRadius: 10, padding: 18, marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1a4d7f" },
  cardSub: { color: "#666", marginTop: 4 },
});
