import React, { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { db } from "../firebaseConfig";
import { ref, onValue, set } from "firebase/database";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [moisture, setMoisture] = useState(0);
  const [rainStatus, setRainStatus] = useState("⏳ Loading...");
  const [servoStatus, setServoStatus] = useState("Idle");

  useEffect(() => {
    navigation.setOptions({
      title: "Home",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Notifications")}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const moistureRef = ref(db, "dryer/moisture");
    const rainRef = ref(db, "dryer/rain_status");
    const servoRef = ref(db, "dryer/status");

    // Listen for changes in moisture
    onValue(moistureRef, (snapshot) => setMoisture(snapshot.val()));

    // Listen for changes in rain status
    onValue(rainRef, (snapshot) => setRainStatus(snapshot.val()));

    // Listen for changes in servo status
    onValue(servoRef, (snapshot) => setServoStatus(snapshot.val()));
  }, []);

  useEffect(() => {
    // Servo motor control based on moisture and rain status (auto mode)
    if (moisture > 50 && rainStatus !== "🌧️ Raining") {
      set(ref(db, "dryer/status"), "Working");
    } else {
      set(ref(db, "dryer/status"), "Idle");
    }
  }, [moisture, rainStatus]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>👕 Clothes Dryer Monitor</Text>

        <Text>🧪 Moisture: {moisture}</Text>
        <Text>{rainStatus}</Text>
        <Text>🔧 Servo: {servoStatus}</Text>

        <View style={styles.divider} />

        <Text>Mode: 🤖 Auto</Text>

      </View>

      {/* 👇 Footer Navigation Bar */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home-outline" size={24} color="#555" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("History")}>
          <Ionicons name="document-text-outline" size={24} color="#555" />
          <Text style={styles.footerText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Controls")}>
          <Ionicons name="settings-outline" size={24} color="#555" />
          <Text style={styles.footerText}>Controls</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={24} color="#555" />
          <Text style={styles.footerText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  divider: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "80%",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    color: "#555",
  },
});
