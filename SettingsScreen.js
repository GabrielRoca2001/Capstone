import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Switch, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig"; // make sure firebaseConfig is correct
import { Ionicons } from "@expo/vector-icons"; // for icons

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);

  // Handle logout functionality
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Yes",
        onPress: () => {
          signOut(auth).catch((error) => {
            Alert.alert("Error", error.message);
          });
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  // Handle clearing cache (if needed)
  const clearCache = () => {
    Alert.alert("Clear Cache", "App cache cleared successfully!"); // This can be enhanced based on app functionality
  };

  // Show app info (version, developer info)
  const showAppInfo = () => {
    Alert.alert(
      "App Info",
      "Clothes Dryer Monitor\nVersion: 1.0.0\nDeveloped by: Bambi Squad"
    );
  };

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <View style={styles.content}>
        <Text style={[styles.title, darkMode && styles.darkText]}>⚙️ Settings</Text>
        <Text style={[styles.subtitle, darkMode && styles.darkText]}>
          Manage your preferences here.
        </Text>

        {/* Dark Mode Toggle */}
        <View style={styles.row}>
          <Text style={[styles.label, darkMode && styles.darkText]}>🌙 Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        {/* App Info Button */}
        <TouchableOpacity style={styles.button} onPress={showAppInfo}>
          <Text style={styles.buttonText}>App Info</Text>
        </TouchableOpacity>

        {/* Clear Cache Button */}
        <TouchableOpacity style={styles.button} onPress={clearCache}>
          <Text style={styles.buttonText}>Clear Cache</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  darkContainer: {
    backgroundColor: "#222",
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center", // Ensures content is pushed to the top
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
  },
  darkText: {
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "red",
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
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
