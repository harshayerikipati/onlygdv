import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ProductsScreen from "./src/screens/ProductsScreen";
import AddProductScreen from "./src/screens/AddProductScreen";
import OrdersScreen from "./src/screens/OrdersScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "OnlyGDV Vendor" }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: "Register Store" }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Dashboard" }} />
        <Stack.Screen name="Products" component={ProductsScreen} options={{ title: "My Products" }} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: "Add Product" }} />
        <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: "Orders" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
