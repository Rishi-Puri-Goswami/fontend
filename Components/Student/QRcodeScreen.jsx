import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Crypto from "expo-crypto";
import axios from "axios";
import {API_URL} from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function QRcodeScreen() {
  const [input, setInput] = useState(null);
  const [showQR, setShowQR] = useState(false);
const route = useRoute();
const {id} = route.params ;
// const id = "skdsd9sdisd" ;
console.log(id , "user id ");
console.log(API_URL , "in qr scane page");


// getingkey

  
  useEffect(() => {
    let interval;

    const sendqrdata = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("⚠️ No token student has to login");
          return;
        }

        // generate random key
        const randomKey = await Crypto.getRandomBytesAsync(16);
        const hexKey = Array.from(randomKey)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        setInput(hexKey);
        console.log("🔑 Generated Key:", hexKey);

        // send key to backend
        const res = await axios.post(
          `${API_URL}/user/getingkey`,
          { key: hexKey },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data) {
          console.log("✅ Server response:", res.data);
        }
      } catch (error) {
        console.log("❌ Error sending QR data:", error.message);
      }
    };

    // run once immediately
    sendqrdata();

    // run every 20 seconds
    // interval = setInterval(sendqrdata, 20000);

    // cleanup when leaving screen/unmount
    return () => clearInterval(interval);
  }, []);





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
      {/* Input Field */}
      {/* <TextInput
        value={input}
        placeholder="Enter data for QR code"
        onChangeText={(text) => {
          setInput(text);
          setShowQR(false);
        }}
        style={{
          width: "100%",
          padding: 12,
          borderWidth: 1,
          borderColor: "#555",
          borderRadius: 8,
          marginBottom: 20,
          color: "#fff",
          backgroundColor: "#1E1E1E",
        }}
        placeholderTextColor="#888"
      /> */}

      {/* Generate Button */}
      {/* <TouchableOpacity
        onPress={() => {
          if (!input.trim()) {
            alert("Please enter some text!");
            return;
          }
          setShowQR(true);
        }}
        style={{
          backgroundColor: "#FFD700",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          marginBottom: 30,
        }}
      >
        <Text style={{ color: "#000", fontWeight: "bold", fontSize: 16 }}>
          Generate QR
        </Text>
      </TouchableOpacity> */}

      {/* QR Preview */}






      {input ? (

<View className="h-fit w-fit bg-white border-white border-[3px]">

        <QRCode value={input} size={220} backgroundColor="#fff"  />
</View>
      ) : (
        <Text style={{ color: "#888" }}>QR code will appear here</Text>
      )}

      <Text className="text-2xl text-white mt-5">Scan at college gate</Text>

    </View>
  );
}
