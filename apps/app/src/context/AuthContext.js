import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

// session === undefined -> still loading from storage
// session === null      -> logged out
// session === { token, user } -> logged in, user.role tells us which stack to show
export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userStr = await AsyncStorage.getItem("user");
        if (token && userStr) {
          setSession({ token, user: JSON.parse(userStr) });
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      }
    })();
  }, []);

  async function login(token, user) {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    setSession({ token, user });
  }

  async function logout() {
    await AsyncStorage.multiRemove(["token", "user"]);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
