import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useCart } from "../../context/CartContext";
import client from "../../api/client";

export default function CartScreen({ navigation }) {
  const { items, vendorId, removeItem, clearCart, total } = useCart();

  async function placeOrder() {
    try {
      await client.post("/api/orders", {
        vendorId,
        items: items.map((i) => ({ productId: i.product.id, qty: i.qty })),
      });
      Alert.alert("Order placed!", "Track it under My Orders.");
      clearCart();
      navigation.navigate("Orders");
    } catch (err) {
      Alert.alert("Could not place order", err.response?.data?.error || "Please log in first");
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.product.id}
        ListEmptyComponent={<Text style={styles.empty}>Your cart is empty.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>{item.product.name} × {item.qty}</Text>
            <Text>₹{(item.product.discountPrice ?? item.product.price) * item.qty}</Text>
            <TouchableOpacity onPress={() => removeItem(item.product.id)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {items.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>Total: ₹{total}</Text>
          <TouchableOpacity style={styles.button} onPress={placeOrder}>
            <Text style={styles.buttonText}>Place Order (COD)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee" },
  remove: { color: "#c0392b", marginLeft: 12 },
  footer: { borderTopWidth: 1, borderColor: "#eee", paddingTop: 16, marginTop: 16 },
  total: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  button: { backgroundColor: "#1a7f37", padding: 14, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
