import { Alert } from "react-native";

export function confirmLogout(logout) {
  Alert.alert("Log out?", "You'll need to log back in to continue.", [
    { text: "Cancel", style: "cancel" },
    { text: "Log out", style: "destructive", onPress: logout },
  ]);
}
