import React, { useEffect, useState } from "react";
import { View, Text, BackHandler } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import * as Crypto from "expo-crypto";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initSocket } from "Components/Socket";

export default function QRcodeScreen() {
  const [qrKey, setQrKey] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [studentId, setStudentId] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const idFromRoute = route?.params?.id;

  let socketInstance = null;

  // Disable Android hardware back button
  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  // Ensure we always have a student id
  useEffect(() => {
    const ensureId = async () => {
      if (idFromRoute) {
        setStudentId(idFromRoute);
      } else {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) return;

          const res = await axios.get(`${API_URL}/user/student`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.data?.student?._id) {
            setStudentId(res.data.student._id);
          }
        } catch (err) {
          console.log("⚠️ Error fetching student ID:", err.message);
        }
      }
    };
    ensureId();
  }, [idFromRoute]);

  // Generate QR key & send to backend
  useEffect(() => {
    const generateAndSendKey = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token || !studentId) return;

        const randomKey = await Crypto.getRandomBytesAsync(16);
        const hexKey = Array.from(randomKey)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        setQrKey(hexKey);

        await axios.post(
          `${API_URL}/user/getingkey`,
          { key: hexKey },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log("❌ Error sending QR data:", error.message);
      }
    };

    if (studentId) generateAndSendKey();
  }, [studentId]);

  // Setup Socket for gate status updates
  useEffect(() => {
    if (!studentId) return;
    let isMounted = true;

    const setupSocket = async () => {
      socketInstance = await initSocket();
      if (!socketInstance || !isMounted) return;

      socketInstance.on("qr_status", (data) => {
        setStatusMessage(data.message);

        if (data.status === "inside") {
          setTimeout(() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "StudentPage" }],
              })
            );
            AsyncStorage.removeItem("gatePermission");
          }, 2000);
        }
      });

      socketInstance.emit("join_room", studentId);
    };

    setupSocket();

    return () => {
      isMounted = false;
      if (socketInstance) socketInstance.off("qr_status");
    };
  }, [studentId]);

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
