import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useCart } from "../../context/CartContext";

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addItem } = useCart();

  return (
    <View style={styles.container}>
      {product.imageUrl ? (
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.vendor}>Sold by {product.vendor?.businessName}</Text>
      <Text style={styles.price}>₹{product.discountPrice ?? product.price}</Text>
      {product.description ? <Text style={styles.desc}>{product.description}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          addItem(product);
          navigation.navigate("Cart");
        }}
      >
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.screenBg },
  image: { width: "100%", height: 220, borderRadius: 10, marginBottom: 16 },
  imagePlaceholder: { backgroundColor: "#ddd" },
  name: { fontSize: 22, fontWeight: "700" },
  vendor: { color: "#888", marginTop: 4 },
  price: { fontSize: 20, color: "#FF3E9D", fontWeight: "700", marginTop: 8 },
  desc: { marginTop: 12, color: "#444", lineHeight: 20 },
  button: { backgroundColor: "#FF3E9D", padding: 14, borderRadius: 8, marginTop: 24 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
