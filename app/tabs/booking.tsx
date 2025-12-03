import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";

export default function BookingScreen() {
  const [selected, setSelected] = useState("canceled"); 
  // opções: "ongoing", "completed", "canceled"

  const filteredBookings = BOOKINGS.filter(item => item.status === selected);

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>⚡</Text>
        <Text style={styles.headerTitle}>My Booking</Text>
      </View>

      {/* FILTER BUTTONS */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setSelected("ongoing")}
          style={[styles.filterButton, selected === "ongoing" && styles.filterActive]}
        >
          <Text style={[styles.filterText, selected === "ongoing" && styles.filterTextActive]}>
            Ongoing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelected("completed")}
          style={[styles.filterButton, selected === "completed" && styles.filterActive]}
        >
          <Text style={[styles.filterText, selected === "completed" && styles.filterTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelected("canceled")}
          style={[styles.filterButton, selected === "canceled" && styles.filterActive]}
        >
          <Text style={[styles.filterText, selected === "canceled" && styles.filterTextActive]}>
            Canceled
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {filteredBookings.map((item, index) => (
          <View key={index} style={styles.card}>
            
            <View style={styles.row}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardLocation}>{item.location}</Text>

                {item.status === "canceled" && (
                  <View style={styles.tagCanceled}>
                    <Text style={styles.tagTextCanceled}>Canceled & Refunded</Text>
                  </View>
                )}

                {item.status === "ongoing" && (
                  <View style={styles.tagOngoing}>
                    <Text style={styles.tagTextOngoing}>Ongoing</Text>
                  </View>
                )}

                {item.status === "completed" && (
                  <View style={styles.tagCompleted}>
                    <Text style={styles.tagTextCompleted}>Completed</Text>
                  </View>
                )}
              </View>
            </View>

            {/* CAIXA DE AVISO APENAS PARA CANCELADOS */}
            {item.status === "canceled" && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>⚠ You canceled this hotel booking</Text>
              </View>
            )}

          </View>
        ))}

      </ScrollView>
    </View>
  );
}

// DADOS EXEMPLO
const BOOKINGS = [
  {
    title: "Palms Casino Resort",
    location: "London, United Kingdom",
    image: "https://i.imgur.com/u5ZQhYI.jpeg",
    status: "canceled",
  },
  {
    title: "The Mark Hotel",
    location: "Luxemburg, Germany",
    image: "https://i.imgur.com/oC5Zb6h.jpeg",
    status: "canceled",
  },
  {
    title: "Palazzo Versace Dubai",
    location: "Dubai, United Arab Emirates",
    image: "https://i.imgur.com/Qf5o3z9.jpeg",
    status: "completed",
  },
  {
    title: "Central Park Hotel",
    location: "New York, USA",
    image: "https://i.imgur.com/Lb5Zb9n.jpeg",
    status: "ongoing",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLogo: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },

  // FILTERS
  filterContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 25,
  },
  filterButton: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#dcdcdc",
  },
  filterActive: {
    backgroundColor: "#1ab65c",
    borderColor: "#1ab65c",
  },
  filterText: {
    color: "#555",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },

  // CARD
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    gap: 15,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111",
  },
  cardLocation: {
    marginTop: 4,
    color: "#666",
  },

  // TAGS
  tagCanceled: {
    backgroundColor: "#ffe4e6",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  tagTextCanceled: {
    color: "#d72638",
    fontSize: 12,
    fontWeight: "600",
  },

  tagOngoing: {
    backgroundColor: "#d1fae5",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  tagTextOngoing: {
    color: "#047857",
    fontSize: 12,
    fontWeight: "600",
  },

  tagCompleted: {
    backgroundColor: "#dbeafe",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  tagTextCompleted: {
    color: "#1d4ed8",
    fontSize: 12,
    fontWeight: "600",
  },

  // WARNING
  warningBox: {
    backgroundColor: "#ffe7ea",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  warningText: {
    color: "#d72638",
  },
});
