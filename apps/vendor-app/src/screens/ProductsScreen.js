import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Switch } from "react-native";
import client from "../api/client";

export default function ProductsScreen() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    client.get("/api/vendors/me").then(({ data }) => setProducts(data.products || []));
  }, []);

  async function toggleAvailable(product) {
    const updated = { ...product, isAvailable: !product.isAvailable };
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    await client.put(`/api/products/${product.id}`, { isAvailable: updated.isAvailable });
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(p) => p.id}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={styles.empty}>No products yet. Add your first one.</Text>}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price} · stock {item.stock}</Text>
          </View>
          <Switch value={item.isAvailable} onValueChange={() => toggleAvailable(item)} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontWeight: "600" },
  price: { color: "#888", marginTop: 4 },
});
