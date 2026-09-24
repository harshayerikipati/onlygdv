import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../theme";

const ROLES = [
  {
    key: "CUSTOMER",
    emoji: "🛍️",
    title: "I'm a Customer",
    subtitle: "shop, snack, get it delivered",
    color: COLORS.customer,
  },
  {
    key: "VENDOR",
    emoji: "🏪",
    title: "I'm a Shop / Restaurant Owner",
    subtitle: "sell your stuff, run your biz",
    color: COLORS.vendor,
  },
  {
    key: "DELIVERY",
    emoji: "🛵",
    title: "I'm a Delivery Rider",
    subtitle: "ride around, get that bag",
    color: COLORS.delivery,
  },
];

export default function RoleSelectScreen({ navigation }) {
  return (
    <LinearGradient
      colors={[COLORS.bgGradientTop, COLORS.bgGradientBottom]}
      style={styles.container}
    >
      <Text style={styles.brand}>OnlyGDV ✨</Text>
      <Text style={styles.tagline}>everything, delivered — no cap 🚀</Text>

      <Text style={styles.prompt}>who's this?</Text>

      {ROLES.map((r) => (
        <TouchableOpacity
          key={r.key}
          style={[styles.card, { shadowColor: r.color }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Login", { role: r.key })}
        >
          <Text style={styles.emoji}>{r.emoji}</Text>
          <Text style={[styles.cardTitle, { color: r.color }]}>{r.title}</Text>
          <Text style={styles.cardSubtitle}>{r.subtitle}</Text>
        </TouchableOpacity>
      ))}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  brand: { fontSize: 36, fontWeight: "900", textAlign: "center", color: COLORS.text },
  tagline: { textAlign: "center", color: COLORS.muted, marginBottom: 28, fontSize: 14 },
  prompt: { textAlign: "center", fontSize: 15, fontWeight: "700", color: COLORS.text, marginBottom: 16 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    alignItems: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  emoji: { fontSize: 30, marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: "800" },
  cardSubtitle: { color: COLORS.muted, marginTop: 4, fontSize: 12.5 },
});
