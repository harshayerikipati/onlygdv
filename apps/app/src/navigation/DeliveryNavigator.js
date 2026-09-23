import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/delivery/HomeScreen";
import OrderDetailScreen from "../screens/delivery/OrderDetailScreen";
import EarningsScreen from "../screens/delivery/EarningsScreen";

const Stack = createNativeStackNavigator();

export default function DeliveryNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "My Deliveries" }} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: "Delivery" }} />
      <Stack.Screen name="Earnings" component={EarningsScreen} options={{ title: "Earnings" }} />
    </Stack.Navigator>
  );
}
