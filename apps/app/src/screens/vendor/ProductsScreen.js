import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Switch, Image } from "react-native";
import client from "../../api/client";
import { COLORS } from "../../theme";

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
      style={{ backgroundColor: COLORS.screenBg }}
      data={products}
      keyExtractor={(p) => p.id}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={styles.empty}>No products yet. Add your first one.</Text>}
      renderItem={({ item }) => (
        <View style={styles.row}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.thumbPlaceholder]} />
          )}
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
  empty: { textAlign: "center", color: COLORS.muted, marginTop: 40 },
  row: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: COLORS.white, borderRadius: 14, marginBottom: 10 },
  thumb: { width: 52, height: 52, borderRadius: 10, marginRight: 12 },
  thumbPlaceholder: { backgroundColor: COLORS.border },
  name: { fontWeight: "600" },
  price: { color: "#888", marginTop: 4 },
});
