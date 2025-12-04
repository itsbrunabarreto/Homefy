import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, QrCode } from "phosphor-react-native";

export default function Ticket() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Recupera os dados reais da reserva vindos do banco/navegação
  const booking = params.data ? JSON.parse(params.data as string) : null;

  if (!booking) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#f4f4f4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comprovante</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40, alignItems: 'center' }}>
        
        {/* Ticket Card */}
        <View style={styles.ticketCard}>
          <Text style={styles.hotelName}>{booking.title}</Text>
          
          {/* QR Code Simulado */}
          <View style={styles.qrContainer}>
             <QrCode size={180} color="#000" />
          </View>

          <View style={styles.divider} />

          {/* Detalhes */}
          <View style={styles.row}>
             <View style={styles.column}>
                <Text style={styles.label}>Nome</Text>
                <Text style={styles.value}>{booking.guestName || "Hóspede"}</Text>
             </View>
             <View style={styles.column}>
                <Text style={styles.label}>E-mail</Text>
                <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
                    {booking.guestEmail || "Não informado"}
                </Text>
             </View>
          </View>

          <View style={styles.row}>
             <View style={styles.column}>
                <Text style={styles.label}>Check-in</Text>
                <Text style={styles.value}>{booking.checkIn}</Text>
             </View>
             <View style={styles.column}>
                <Text style={styles.label}>Check-out</Text>
                <Text style={styles.value}>{booking.checkOut}</Text>
             </View>
          </View>

          <View style={styles.row}>
             <View style={styles.column}>
                <Text style={styles.label}>Hotel</Text>
                <Text style={styles.value} numberOfLines={1}>{booking.title}</Text>
             </View>
             <View style={styles.column}>
                <Text style={styles.label}>Hóspedes</Text>
                <Text style={styles.value}>{booking.guests}</Text>
             </View>
          </View>
        </View>

      </ScrollView>

      {/* Botão Download */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.downloadButton}>
           <Text style={styles.buttonText}>Baixar Comprovante</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f4f4f4",
  },
  ticketCard: {
    backgroundColor: "#fff", // Ticket branco para contraste
    width: "100%",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    borderRadius: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: {
    flex: 1,
  },
  label: {
    color: "#757575",
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: "#000",
    fontSize: 15,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignSelf: 'center',
  },
  downloadButton: {
    backgroundColor: "#1ab65c",
    height: 56,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});