import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ROLES = [
  {
    key: "CUSTOMER",
    title: "I'm a Customer",
    subtitle: "Order food, groceries & more",
    color: "#1a7f37",
  },
  {
    key: "VENDOR",
    title: "I'm a Shop / Restaurant Owner",
    subtitle: "Sell on OnlyGDV",
    color: "#1a4d7f",
  },
  {
    key: "DELIVERY",
    title: "I'm a Delivery Rider",
    subtitle: "Deliver orders & earn",
    color: "#c9540c",
  },
];

export default function RoleSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>OnlyGDV</Text>
      <Text style={styles.tagline}>Shopping, food & groceries — delivered</Text>

      <View style={styles.cards}>
        {ROLES.map((r) => (
          <TouchableOpacity
            key={r.key}
            style={[styles.card, { borderColor: r.color }]}
            onPress={() => navigation.navigate("Login", { role: r.key })}
          >
            <Text style={[styles.cardTitle, { color: r.color }]}>{r.title}</Text>
            <Text style={styles.cardSubtitle}>{r.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  brand: { fontSize: 34, fontWeight: "800", textAlign: "center", color: "#222" },
  tagline: { textAlign: "center", color: "#777", marginBottom: 40 },
  cards: { gap: 16 },
  card: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 20,
  },
  cardTitle: { fontSize: 17, fontWeight: "700" },
  cardSubtitle: { color: "#777", marginTop: 4, fontSize: 13 },
});
