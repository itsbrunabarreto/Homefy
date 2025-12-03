import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "phosphor-react-native";

export default function Notifications() {
  const router = useRouter();

  const [general, setGeneral] = useState(true);
  const [sound, setSound] = useState(false);
  const [vibrate, setVibrate] = useState(false);
  const [updates, setUpdates] = useState(true);
  const [services, setServices] = useState(false);
  const [tips, setTips] = useState(false);

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 28 }} /> 
      </View>

      {/* OPTIONS */}
      <View style={styles.section}>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>General Notification</Text>
          <Switch value={general} onValueChange={setGeneral} thumbColor="#1ab65c" />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Sound</Text>
          <Switch value={sound} onValueChange={setSound} thumbColor="#1ab65c" />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Vibrate</Text>
          <Switch value={vibrate} onValueChange={setVibrate} thumbColor="#1ab65c" />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>App Updates</Text>
          <Switch value={updates} onValueChange={setUpdates} thumbColor="#1ab65c" />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>New Service Available</Text>
          <Switch value={services} onValueChange={setServices} thumbColor="#1ab65c" />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>New tips available</Text>
          <Switch value={tips} onValueChange={setTips} thumbColor="#1ab65c" />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  section: {
    marginTop: 40,
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: "#1f1f1f",
  },

  optionLabel: {
    color: "#fff",
    fontSize: 16,
  },
});
