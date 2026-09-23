import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import RoleSelectScreen from "./src/screens/RoleSelectScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import CustomerNavigator from "./src/navigation/CustomerNavigator";
import VendorNavigator from "./src/navigation/VendorNavigator";
import DeliveryNavigator from "./src/navigation/DeliveryNavigator";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="RoleSelect" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true, title: "" }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: true, title: "" }} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { session } = useAuth();

  // Still checking AsyncStorage for a saved session
  if (session === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1a7f37" />
      </View>
    );
  }

  // Not logged in -> role picker then login/signup
  if (!session) {
    return <AuthStack />;
  }

  // Logged in -> route straight into that role's app.
  // Each navigator has its own "Log out" action (see the role's home/dashboard
  // screen) which clears the session and drops back here, re-rendering AuthStack.
  switch (session.user.role) {
    case "CUSTOMER":
      return <CustomerNavigator />;
    case "VENDOR":
      return <VendorNavigator />;
    case "DELIVERY":
      return <DeliveryNavigator />;
    default:
      return <AuthStack />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
