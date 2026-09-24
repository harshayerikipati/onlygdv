import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from "react-native";
import { useCart } from "../../context/CartContext";
import client from "../../api/client";
import { COLORS } from "../../theme";

export default function CartScreen({ navigation }) {
  const { items, vendorId, removeItem, clearCart, total } = useCart();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [placing, setPlacing] = useState(false);

  async function placeOrder() {
    if (!address.trim()) {
      Alert.alert("Address needed", "Add a delivery address so the rider knows where to bring your order.");
      return;
    }
    setPlacing(true);
    try {
      await client.post("/api/orders", {
        vendorId,
        items: items.map((i) => ({ productId: i.product.id, qty: i.qty })),
        deliveryAddress: address.trim(),
        customerPhone: phone.trim() || undefined,
      });
      Alert.alert("Order placed! 🎉", "Track it under My Orders.");
      clearCart();
      navigation.navigate("Orders");
    } catch (err) {
      Alert.alert("Could not place order", err.response?.data?.error || "Please log in first");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: COLORS.screenBg }]}>
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
          <TextInput
            style={styles.input}
            placeholder="Delivery address (house no, street, area)"
            value={address}
            onChangeText={setAddress}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Contact phone for this order (optional)"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.total}>Total: ₹{total}</Text>
          <TouchableOpacity style={styles.button} onPress={placeOrder} disabled={placing}>
            <Text style={styles.buttonText}>{placing ? "Placing order..." : "Place Order (COD)"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  empty: { textAlign: "center", color: COLORS.muted, marginTop: 40 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderColor: COLORS.border },
  remove: { color: "#c0392b", marginLeft: 12 },
  footer: { borderTopWidth: 1, borderColor: COLORS.border, paddingTop: 16, marginTop: 16 },
  input: { backgroundColor: COLORS.white, borderRadius: 12, padding: 12, marginBottom: 10 },
  total: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  button: { backgroundColor: COLORS.customer, padding: 14, borderRadius: 12 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
