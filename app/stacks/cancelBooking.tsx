import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, PaypalLogo, GoogleLogo, AppleLogo, CreditCard } from "phosphor-react-native";

// Firebase
import { db } from "../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export default function CancelBooking() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const booking = params.data ? JSON.parse(params.data as string) : null;
  
  const [selectedMethod, setSelectedMethod] = useState("paypal");
  const [loading, setLoading] = useState(false);

  // Cálculo de reembolso (80% simulado)
  const refundAmount = booking ? (booking.price * 0.8).toFixed(2) : "0.00";

  const handleConfirmCancellation = async () => {
    if (!booking?.id) return;

    setLoading(true);
    try {
      // ATUALIZA O STATUS NO FIREBASE
      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, {
        status: "Canceled",
        refundAmount: refundAmount,
        canceledAt: new Date().toISOString()
      });

      Alert.alert("Cancelado", "Sua reserva foi cancelada com sucesso.", [
        { text: "OK", onPress: () => router.replace("/tabs/booking") } // Volta e recarrega
      ]);

    } catch (error) {
      Alert.alert("Erro", "Não foi possível cancelar.");
    } finally {
      setLoading(false);
    }
  };

  const renderMethod = (id, icon, label) => (
    <TouchableOpacity 
      style={styles.methodCard} 
      onPress={() => setSelectedMethod(id)}
    >
      <View style={{flexDirection: 'row', gap: 12, alignItems: 'center'}}>
        {icon}
        <Text style={styles.methodText}>{label}</Text>
      </View>
      <View style={[styles.radio, selectedMethod === id && styles.radioActive]}>
         {selectedMethod === id && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#f4f4f4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cancel Hotel Booking</Text>
        <View style={{ width: 28 }} />
      </View>

      <Text style={styles.descText}>
        Please select a payment refund method (only 80% will be refunded).
      </Text>

      <View style={styles.methodsContainer}>
         {renderMethod('paypal', <PaypalLogo size={24} color="#00457C" weight="fill"/>, 'PayPal')}
         {renderMethod('google', <GoogleLogo size={24} color="#DB4437" weight="fill"/>, 'Google Pay')}
         {renderMethod('card', <CreditCard size={24} color="#1ab65c" weight="fill"/>, '•••• •••• •••• 4679')}
      </View>

      <View style={styles.footer}>
         <Text style={styles.refundInfo}>
            Paid: ${booking?.price}  Refund: <Text style={{color: '#1ab65c'}}>${refundAmount}</Text>
         </Text>
         
         <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleConfirmCancellation}
            disabled={loading}
         >
            {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Confirm Cancellation</Text>}
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f4f4f4",
  },
  descText: {
    color: "#f4f4f4",
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 22,
  },
  methodsContainer: {
    gap: 16,
  },
  methodCard: {
    backgroundColor: "#1f222a",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  methodText: {
    color: "#f4f4f4",
    fontWeight: "bold",
    fontSize: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1ab65c",
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: {
    borderColor: "#1ab65c",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1ab65c",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignSelf: 'center',
    alignItems: 'center',
    gap: 20,
  },
  refundInfo: {
    color: "#757575",
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: "#1ab65c",
    width: "100%",
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