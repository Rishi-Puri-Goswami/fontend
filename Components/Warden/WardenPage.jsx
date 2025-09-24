import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "Components/Socket";

const WardenPage = ({ navigation }) => {
  const [allrequest, setallrequest] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const naviga = useNavigation();

  // ✅ Fetch all pending requests on page load
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return console.log("⚠️ Invalid user");

        const res = await axios.get(`${API_URL}/warden/requests`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.requests) {
          setallrequest(res.data.requests);
        }
      } catch (error) {
        console.log("❌ Error fetching pending requests", error);
      }
    };

    fetchPendingRequests();
  }, []);

  // ✅ Socket listener for new student requests
  useEffect(() => {
    socket.on("new_request", (data) => {
      console.log("📩 New student request:", data);
      Alert.alert("New Request", `${data.name} requested outpass!`);
      setallrequest((prev) => [data, ...prev]); // add new request on top
    });

    return () => socket.off("new_request");
  }, []);

  // ✅ Accept / Deny request
  const handleStudentRequest = async ({ action, studentId }) => {
    if (!action || !studentId) return console.log("⚠️ Invalid request");

    const token = await AsyncStorage.getItem("token");
    if (!token) return console.log("⚠️ Invalid user");

    try {
      const res = await axios.post(
        `${API_URL}/warden/handle-request/${studentId}`,
        { action },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data) {
        // ✅ Show feedback
        Alert.alert(
          "Success",
          action === "accept"
            ? "✅ You have accepted this request"
            : "❌ You have declined this request"
        );

        // ✅ Remove from UI instantly
        setallrequest((prev) => prev.filter((item) => item._id !== studentId));
      }
    } catch (error) {
      console.log("❌ Error on accept/decline", error);
    }
  };

  const handleNavigate = (screen) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#000" />
      <View style={styles.backgroundLayer} />

      {/* Header */}
      <View style={styles.menuBar}>
        <Text style={[styles.menuTitle, { fontSize: 24 }]}>Warden</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MaterialIcons name="more-vert" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => naviga.navigate("Wardenhistory")}
            >
              <Text style={styles.dropdownText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleNavigate("LiveStudent")}
            >
              <Text style={styles.dropdownText}>Live Students</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Student Cards */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {allrequest.length === 0 && (
          <Text style={{ color: "#fff", marginTop: 20 }}>
            🚀 No pending requests
          </Text>
        )}

        {allrequest.map((item) => (
          <View key={item._id} style={styles.card}>
            <Text style={styles.cardTitle}>Student's Information</Text>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{item.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{item.phoneNo}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Room No:</Text>
              <Text style={styles.value}>{item.roomNo}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Destination:</Text>
              <Text style={styles.value}>{item.destination}</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() =>
                  handleStudentRequest({ action: "decline", studentId: item._id })
                }
                style={[styles.actionButton, styles.denyButton]}
              >
                <Text style={styles.buttonText}>Deny</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  handleStudentRequest({ action: "accept", studentId: item._id })
                }
                style={[styles.actionButton, styles.acceptButton]}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#171717" },
  backgroundLayer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#404040",
    transform: [{ rotate: "45deg" }],
  },
  menuBar: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuTitle: { color: "#facc15", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 80,
    paddingRight: 10,
  },
  dropdownMenu: {
    backgroundColor: "#222",
    borderRadius: 6,
    paddingVertical: 6,
    width: 160,
    elevation: 10,
  },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16 },
  dropdownText: { color: "#fff", fontSize: 16 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#facc15",
    marginBottom: 6,
  },
  divider: { height: 1, backgroundColor: "#333", marginBottom: 12 },
  infoRow: { flexDirection: "row", marginBottom: 8 },
  label: {
    color: "#9ca3af",
    fontWeight: "bold",
    width: 120,
    fontSize: 14,
  },
  value: { color: "#fff", fontSize: 14, flexShrink: 1 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  denyButton: { backgroundColor: "#ef4444" },
  acceptButton: { backgroundColor: "#22c55e" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});

export default WardenPage;
