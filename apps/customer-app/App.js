import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import CartScreen from "./src/screens/CartScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import { CartProvider } from "./src/context/CartContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "OnlyGDV" }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ title: "Create Account" }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Browse" }} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Product" }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ title: "Cart" }} />
          <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: "My Orders" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
