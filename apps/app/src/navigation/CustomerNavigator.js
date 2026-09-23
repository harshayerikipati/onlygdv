import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/customer/HomeScreen";
import ProductDetailScreen from "../screens/customer/ProductDetailScreen";
import CartScreen from "../screens/customer/CartScreen";
import OrdersScreen from "../screens/customer/OrdersScreen";
import { CartProvider } from "../context/CartContext";

const Stack = createNativeStackNavigator();

export default function CustomerNavigator() {
  return (
    <CartProvider>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Browse" }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Product" }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: "Cart" }} />
        <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: "My Orders" }} />
      </Stack.Navigator>
    </CartProvider>
  );
}
