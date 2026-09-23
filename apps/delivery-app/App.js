import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import OrderDetailScreen from "./src/screens/OrderDetailScreen";
import EarningsScreen from "./src/screens/EarningsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "OnlyGDV Delivery" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "My Deliveries" }} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: "Delivery" }} />
        <Stack.Screen name="Earnings" component={EarningsScreen} options={{ title: "Earnings" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
