import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// When testing on a physical device, replace with your machine's LAN IP, e.g. "http://192.168.1.10:4000"
export const API_URL = "https://onlygdv-production.up.railway.app";

const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
