
import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, CaretRight } from "phosphor-react-native";

export default function Security() {
  const router = useRouter();

  const [faceId, setFaceId] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [touchId, setTouchId] = useState(true);
  const [googleAuth, setGoogleAuth] = useState(false); 

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon size={26} color="#f4f4f4" weight="regular" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Security</Text>

        <View style={{ width: 26 }} /></View>

      <View style={styles.section}>
        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Face ID</Text>
          <Switch
            value={faceId}
            onValueChange={setFaceId}
            thumbColor={Platform.OS === "android" ? (faceId ? "#1ab65c" : "#f4f4f4") : undefined}
            trackColor={{ false: "#444", true: "#7EE7B3" }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Remember me</Text>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            thumbColor={Platform.OS === "android" ? (rememberMe ? "#1ab65c" : "#f4f4f4") : undefined}
            trackColor={{ false: "#444", true: "#7EE7B3" }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Touch ID</Text>
          <Switch
            value={touchId}
            onValueChange={setTouchId}
            thumbColor={Platform.OS === "android" ? (touchId ? "#1ab65c" : "#f4f4f4") : undefined}
            trackColor={{ false: "#444", true: "#7EE7B3" }}
          />
        </View>

        <TouchableOpacity
          style={[styles.optionRow, styles.chevronRow]}
          onPress={() => {

          }}
          activeOpacity={0.8}
        >
          <Text style={styles.optionLabel}>Google Authenticator</Text>
          <CaretRight size={20} color="#f4f4f4" />
        </TouchableOpacity>
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
    marginBottom: 30,
  },

  headerTitle: {
    color: "#f4f4f4",
    fontSize: 20,
    fontWeight: "700",
  },

  section: {
    marginTop: 8,
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },

  optionLabel: {
    color: "#e6e6e6",
    fontSize: 16,
  },

  chevronRow: {
    borderBottomWidth: 0, 
  },
});
