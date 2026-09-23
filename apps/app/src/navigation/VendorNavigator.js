import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/vendor/DashboardScreen";
import ProductsScreen from "../screens/vendor/ProductsScreen";
import AddProductScreen from "../screens/vendor/AddProductScreen";
import OrdersScreen from "../screens/vendor/OrdersScreen";

const Stack = createNativeStackNavigator();

export default function VendorNavigator() {
  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Dashboard" }} />
      <Stack.Screen name="Products" component={ProductsScreen} options={{ title: "My Products" }} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: "Add Product" }} />
      <Stack.Screen name="VendorOrders" component={OrdersScreen} options={{ title: "Orders" }} />
    </Stack.Navigator>
  );
}
