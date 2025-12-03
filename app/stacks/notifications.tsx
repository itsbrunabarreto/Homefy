import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { 
  ArrowLeft, 
  CheckCircle, 
  Wallet, 
  XCircle, 
  ShieldCheck, 
  DotsThreeCircle 
} from "phosphor-react-native";

export default function Notifications() {
  const router = useRouter();

  // Dados mockados baseados na sua imagem
  const notifications = [
    {
      date: "Today",
      items: [
        {
          id: 1,
          title: "Payment Successful!",
          desc: "Laluna Hotel booking was successful!",
          icon: <CheckCircle size={24} color="#fff" weight="fill" />,
          color: "#1ab65c", // Verde
        },
        {
          id: 2,
          title: "E-Wallet Connected",
          desc: "E-Wallet has been connected to Homefy",
          icon: <Wallet size={24} color="#fff" weight="fill" />,
          color: "#00bdd3", // Azul claro
        },
      ]
    },
    {
      date: "Yesterday",
      items: [
        {
          id: 3,
          title: "Hotel Booking Canceled",
          desc: "You have canceled your hotel booking",
          icon: <XCircle size={24} color="#fff" weight="fill" />,
          color: "#ff4d4d", // Vermelho
        },
        {
          id: 4,
          title: "2 step verification successful",
          desc: "Laluna Hotel booking was successful!",
          icon: <ShieldCheck size={24} color="#fff" weight="fill" />,
          color: "#4a90e2", // Azul
        },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#f4f4f4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <TouchableOpacity>
          <DotsThreeCircle size={28} color="#f4f4f4" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.dateTitle}>{section.date}</Text>
            
            {section.items.map((item) => (
              <View key={item.id} style={styles.notificationCard}>
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  {item.icon}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.notifDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181a20",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f4f4f4",
  },
  content: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  dateTitle: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 14,
  },
  notificationCard: {
    backgroundColor: "#1f222a",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  notifTitle: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  notifDesc: {
    color: "#757575",
    fontSize: 13,
    lineHeight: 18,
  },
});