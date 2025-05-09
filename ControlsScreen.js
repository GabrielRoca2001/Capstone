import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import { ref, onValue, set } from "firebase/database";
import { db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function ControlsScreen({ navigation }) {
  const [manualMode, setManualMode] = useState(false);
  const [servoAngle, setServoAngle] = useState(90);

  useEffect(() => {
    const manualRef = ref(db, "dryer/manual_mode");
    const angleRef = ref(db, "dryer/manual_servo");

    onValue(manualRef, (snapshot) => {
      const mode = snapshot.val();
      if (mode !== null) setManualMode(mode);
    });

    onValue(angleRef, (snapshot) => {
      const angle = snapshot.val();
      if (angle !== null) setServoAngle(angle);
    });
  }, []);

  useEffect(() => {
    set(ref(db, "dryer/manual_mode"), manualMode);
    set(ref(db, "dryer/manual_servo"), servoAngle);
  }, [manualMode, servoAngle]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🛠️ Controls</Text>

        <View style={styles.section}>
          <Text style={styles.label}>
            Mode: {manualMode ? "Manual 🛠️" : "Auto 🤖"}
          </Text>
          <Switch
            value={manualMode}
            onValueChange={setManualMode}
            trackColor={{ false: "#ccc", true: "#007bff" }}
            thumbColor={manualMode ? "#007bff" : "#f4f3f4"}
          />
        </View>

        {manualMode && (
          <View style={styles.section}>
            <Text style={styles.label}>Servo Angle: {servoAngle}°</Text>
            <Slider
              style={{ width: 250 }}
              minimumValue={0}
              maximumValue={180}
              step={1}
              value={servoAngle}
              onValueChange={setServoAngle}
              minimumTrackTintColor="#007bff"
              maximumTrackTintColor="#ccc"
            />
          </View>
        )}
      </View>

      {/* 👇 Fixed Footer Navigation Bar */}
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
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start", // Ensures content is pushed to the top
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
    position: "absolute", // Makes footer fixed
    bottom: 0, // Keeps footer at the bottom
    left: 0,
    right: 0,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    color: "#555",
  },
});
