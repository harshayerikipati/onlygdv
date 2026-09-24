import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import client from "../../api/client";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { confirmLogout } from "../../utils/confirmLogout";
import { COLORS } from "../../theme";

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { items } = useCart();
  const { logout } = useAuth();

  useEffect(() => {
    client.get("/api/products").then(({ data }) => setProducts(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.screenBg }]}>
        <ActivityIndicator size="large" color={COLORS.customer} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.screenBg }}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <Text style={styles.cartLink}>Cart ({items.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
          <Text style={styles.cartLink}>My Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmLogout(logout)}>
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No products yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ProductDetail", { product: item })}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.vendor}>{item.vendor?.businessName}</Text>
              <Text style={styles.price}>₹{item.discountPrice ?? item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: { flexDirection: "row", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderColor: COLORS.border },
  cartLink: { color: COLORS.customer, fontWeight: "600" },
  logout: { color: COLORS.muted },
  empty: { textAlign: "center", color: COLORS.muted, marginTop: 40 },
  card: { flexDirection: "row", backgroundColor: COLORS.white, borderRadius: 14, padding: 12, marginBottom: 12, alignItems: "center" },
  image: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  imagePlaceholder: { backgroundColor: COLORS.border },
  name: { fontWeight: "600", fontSize: 15 },
  vendor: { color: "#888", fontSize: 12 },
  price: { color: COLORS.customer, fontWeight: "700", marginTop: 4 },
});
