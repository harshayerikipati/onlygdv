import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your live Railway backend. Change this if your URL differs.
export const API_URL = "https://onlygdv-production.up.railway.app";

const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
