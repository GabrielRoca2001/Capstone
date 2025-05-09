import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

const HistoryScreen = ({ navigation }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const historyRef = ref(db, '/dryer/history');

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setHistoryData(entries);
      } else {
        setHistoryData([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
      <Text>🌡️ Moisture: {item.moisture}</Text>
      <Text>🌧️ Rain Status: {item.rain_status}</Text>
      <Text>🔧 Servo Status: {item.servo_status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Dryer History Logs</Text>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#4a90e2" />
          </View>
        ) : (
          <FlatList
            data={historyData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
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
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  timestamp: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4a4a4a',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#555',
  },
});

export default HistoryScreen;
