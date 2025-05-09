import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";

const STORAGE_KEY = "dryer_notifications";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load notifications from AsyncStorage on mount
    const loadStoredNotifications = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
      setLoading(false);
    };
    loadStoredNotifications();

    // Firebase listener for new status
    const statusRef = ref(db, "/dryer/status");

    onValue(statusRef, async (snapshot) => {
      const newStatus = snapshot.val();
      if (newStatus) {
        const newNotification = {
          message: newStatus,
          timestamp: new Date().toISOString(),
        };

        setNotifications((prev) => {
          const updated = [newNotification, ...prev].slice(0, 10);
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); // Save
          return updated;
        });
      }
    });

  }, []);

  const getEmoji = (message) => {
    if (!message) return "🔔";
    if (message.includes("Rain")) return "🌧️";
    if (message.includes("Dry")) return "✅";
    if (message.includes("Wet")) return "💧";
    if (message.includes("Manual")) return "⚙️";
    return "🔔";
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getEmoji(item.message)}</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.message}>{item.message || "No message"}</Text>
        <Text style={styles.time}>{formatTimestamp(item.timestamp)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatar: {
    backgroundColor: "#e6f0ff",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
  },
  textBox: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});
