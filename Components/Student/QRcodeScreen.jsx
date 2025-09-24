import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Crypto from "expo-crypto";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "Components/Socket"; // 👈 your socket.io-client instance

export default function QRcodeScreen() {
  const [qrKey, setQrKey] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params; 

  // 🔹 Generate QR key & send to backend
  useEffect(() => {
    const generateAndSendKey = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("⚠️ No token found — student must login");
          return;
        }

        // Generate random 16-byte key
        const randomKey = await Crypto.getRandomBytesAsync(16);
        const hexKey = Array.from(randomKey)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        setQrKey(hexKey);
        console.log("🔑 Generated Key:", hexKey);

        // Send key to backend
        const res = await axios.post(
          `${API_URL}/user/getingkey`,
          { key: hexKey },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ Server response:", res.data);
      } catch (error) {
        console.log("❌ Error sending QR data:", error.message);
      }
    };

    generateAndSendKey();
  }, []);

  // 🔹 Listen for real-time gate updates
  useEffect(() => {
    if (!id) return;

    // Join this student's room (if your backend uses rooms)
    socket.emit("join_room", id);

    socket.on("gate_status", (data) => {
      console.log("📩 Gate update:", data);
      setStatusMessage(data.message);

      if (data.status === "inside") {
        // ✅ Student came back inside → navigate home after 2s
        setTimeout(() => {
          navigation.navigate("StudentHome"); // change to your home screen name
        }, 2000);
      }
    });

    return () => {
      socket.off("gate_status");
    };
  }, [id]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        paddingHorizontal: 20,
      }}
    >
      {/* QR Code */}
      {qrKey ? (
        <View style={{ backgroundColor: "white", padding: 10, borderRadius: 8 }}>
          <QRCode value={qrKey} size={220} backgroundColor="#fff" />
        </View>
      ) : (
        <Text style={{ color: "#888" }}>Generating QR code...</Text>
      )}

      {/* Status Message */}
      {statusMessage ? (
        <Text style={{ color: "#4ade80", fontSize: 18, marginTop: 20 }}>
          {statusMessage}
        </Text>
      ) : (
        <Text style={{ color: "#888", marginTop: 20 }}>
          Scan at college gate
        </Text>
      )}
    </View>
  );
}
