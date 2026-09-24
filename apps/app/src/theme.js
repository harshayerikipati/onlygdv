// OnlyGDV theme — soft, colorful, genz-leaning palette.
// One accent color per role, used consistently across that role's screens.
export const COLORS = {
  customer: "#FF3E9D", // hot pink
  customerDark: "#D6187A",
  vendor: "#7C4DFF", // electric purple
  vendorDark: "#5B2FD6",
  delivery: "#00C2A8", // neon teal
  deliveryDark: "#00947F",

  bgGradientTop: "#FFE3F1", // soft pink
  bgGradientBottom: "#EDE4FF", // soft lavender
  screenBg: "#FFF7FB", // gentle tint used behind lists/forms instead of plain white

  text: "#2B1834",
  muted: "#9C8AA5",
  white: "#FFFFFF",
  cardBg: "rgba(255,255,255,0.85)",
  border: "#F0DCEB",
};

export function roleColor(role) {
  if (role === "CUSTOMER") return COLORS.customer;
  if (role === "VENDOR") return COLORS.vendor;
  if (role === "DELIVERY") return COLORS.delivery;
  return COLORS.customer;
}

export function roleColorDark(role) {
  if (role === "CUSTOMER") return COLORS.customerDark;
  if (role === "VENDOR") return COLORS.vendorDark;
  if (role === "DELIVERY") return COLORS.deliveryDark;
  return COLORS.customerDark;
}
