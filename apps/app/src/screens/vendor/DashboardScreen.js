import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { confirmLogout } from "../../utils/confirmLogout";

export default function DashboardScreen({ navigation }) {
  const [vendor, setVendor] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    client.get("/api/vendors/me").then(({ data }) => setVendor(data)).catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.name}>{vendor?.businessName || "Your store"}</Text>
          <Text style={styles.status}>Status: {vendor?.status || "..."}</Text>
        </View>
        <TouchableOpacity onPress={() => confirmLogout(logout)}>
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Products")}>
        <Text style={styles.cardTitle}>My Products</Text>
        <Text style={styles.cardSub}>{vendor?.products?.length ?? 0} items listed</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("VendorOrders")}>
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
  container: { flex: 1, padding: 20, backgroundColor: COLORS.screenBg },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  name: { fontSize: 24, fontWeight: "700" },
  status: { color: "#888", marginTop: 4, textTransform: "capitalize" },
  logout: { color: "#999" },
  card: { backgroundColor: "#f2f6fa", borderRadius: 10, padding: 18, marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#7C4DFF" },
  cardSub: { color: "#666", marginTop: 4 },
});
