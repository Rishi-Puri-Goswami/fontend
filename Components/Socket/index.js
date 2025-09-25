import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

let socket = null;

export const initSocket = async () => {
  if (socket) return socket; // already initialized

  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Invalid user");
      return null;
    }

    socket = io("http://10.159.144.143:4000", {
      transports: ["websocket"],
      auth: { token }, // send token in handshake
    });

    socket.on("connect", () => {
      console.log("Connected to server with socket ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    return socket;
  } catch (error) {
    console.log("Error initializing socket:", error);
    return null;
  }
};

export default socket;
