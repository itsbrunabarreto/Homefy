import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  ActivityIndicator,
  Alert
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { 
  ArrowLeft, 
  CreditCard, 
  CheckCircle, 
  QrCode,
  PaypalLogo,
  GoogleLogo,
  AppleLogo
} from "phosphor-react-native";

// Firebase
import { auth, db } from "../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export default function ConfirmPayment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fullData, setFullData] = useState<any>(null);

  useEffect(() => {
    if (params.data) {
      setFullData(JSON.parse(params.data as string));
    }
  }, [params.data]);

  if (!fullData) {
    return <View style={styles.container}><ActivityIndicator color="#1ab65c" /></View>;
  }

  const { property, reservation, guestInfo, paymentMethod } = fullData;

  // Cálculos
  const nights = reservation.nights;
  const price = property.price;
  const subtotal = price * nights;
  const taxes = subtotal * 0.10; // 10% de taxa
  const total = subtotal + taxes;

  // Renderiza o ícone do método escolhido
  const getMethodIcon = () => {
      if(paymentMethod.type === 'pix') return <QrCode size={24} color="#1ab65c" />;
      if(paymentMethod.type === 'card') return <CreditCard size={24} color="#1ab65c" weight="fill" />;
      if(paymentMethod.label === 'PayPal') return <PaypalLogo size={24} color="#00457C" weight="fill" />;
      return <CreditCard size={24} color="#1ab65c" weight="fill" />;
  }

  async function handleFinalize() {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Faça login.");

      // Salva a reserva final no banco
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        propertyId: property.id,
        title: property.title,
        location: property.location,
        image: property.image, 
        price: total,
        status: "Ongoing",
        
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        guestName: guestInfo.fullName,
        guestEmail: guestInfo.email,
        
        paymentMethod: paymentMethod.label,
        createdAt: new Date().toISOString()
      });

      setShowSuccessModal(true);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#f4f4f4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmar Pagamento</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        {/* CARD RESUMO HOTEL */}
        <View style={styles.summaryCard}>
            <Image 
                source={property.image ? { uri: property.image } : require("../assets/Room.jpg")} 
                style={styles.hotelImage} 
            />
            <View style={styles.hotelInfo}>
                <Text style={styles.hotelName} numberOfLines={1}>{property.title}</Text>
                <Text style={styles.hotelLocation} numberOfLines={1}>{property.location}</Text>
                <Text style={styles.ratingText}>⭐ {property.rating || 4.8} (Reviews)</Text>
            </View>
            <View>
                <Text style={styles.priceText}>${price}</Text>
                <Text style={styles.priceUnit}>/noite</Text>
            </View>
        </View>

        {/* GRID DE DATAS E HÓSPEDES */}
        <View style={styles.detailsGrid}>
            <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Check in</Text>
                <Text style={styles.gridValue}>{new Date(reservation.checkIn).toLocaleDateString()}</Text>
            </View>
            <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Check out</Text>
                <Text style={styles.gridValue}>{new Date(reservation.checkOut).toLocaleDateString()}</Text>
            </View>
            <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Hóspedes</Text>
                <Text style={styles.gridValue}>{reservation.guests}</Text>
            </View>
        </View>

        {/* RESUMO FINANCEIRO */}
        <View style={styles.costContainer}>
            <View style={styles.costRow}>
                <Text style={styles.costLabel}>{nights} Noites</Text>
                <Text style={styles.costValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.costRow}>
                <Text style={styles.costLabel}>Taxas (10%)</Text>
                <Text style={styles.costValue}>${taxes.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.costRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
        </View>

        {/* MÉTODO SELECIONADO (Igual a imagem) */}
        <View style={styles.selectedMethodCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                {getMethodIcon()}
                <Text style={styles.methodText}>{paymentMethod.label}</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.changeText}>Alterar</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>

      {/* BOTÃO CONFIRMAR */}
      <View style={styles.footer}>
        <TouchableOpacity 
            style={styles.confirmButton} 
            onPress={handleFinalize}
            disabled={loading}
        >
            {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Pagar ${total.toFixed(2)}</Text>}
        </TouchableOpacity>
      </View>

      {/* MODAL SUCESSO */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
              <View style={styles.successIcon}><CheckCircle size={48} color="#fff" weight="fill" /></View>
              <Text style={styles.modalTitle}>Sucesso!</Text>
              <Text style={styles.modalDesc}>Seu pagamento foi processado e a reserva confirmada.</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => {
                  setShowSuccessModal(false);
                  router.replace("/tabs/booking");
              }}>
                 <Text style={styles.buttonText}>Ver Comprovante</Text>
              </TouchableOpacity>
           </View>
        </View>
      </Modal>

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
  // Summary Card
  summaryCard: {
    backgroundColor: "#1f222a",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  hotelImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#333",
  },
  hotelInfo: {
    flex: 1,
    gap: 4,
  },
  hotelName: {
    color: "#f4f4f4",
    fontWeight: "bold",
    fontSize: 16,
  },
  hotelLocation: {
    color: "#757575",
    fontSize: 12,
  },
  ratingText: {
    color: "#1ab65c",
    fontSize: 12,
    fontWeight: "600",
  },
  priceText: {
    color: "#1ab65c",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'right'
  },
  priceUnit: {
    color: "#757575",
    fontSize: 10,
    textAlign: 'right'
  },
  // Grid Details
  detailsGrid: {
    backgroundColor: "#1f222a",
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    alignItems: 'center',
    gap: 8
  },
  gridLabel: {
    color: "#757575",
    fontSize: 12,
  },
  gridValue: {
    color: "#f4f4f4",
    fontWeight: "bold",
    fontSize: 14,
  },
  // Costs
  costContainer: {
    backgroundColor: "#1f222a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  costLabel: { color: "#757575", fontSize: 14 },
  costValue: { color: "#f4f4f4", fontSize: 14, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#333", marginVertical: 12 },
  totalLabel: { color: "#f4f4f4", fontSize: 16, fontWeight: "bold" },
  totalValue: { color: "#1ab65c", fontSize: 18, fontWeight: "bold" },
  
  // Selected Method Card
  selectedMethodCard: {
      backgroundColor: "#1f222a",
      borderRadius: 16,
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
  },
  methodText: {
      color: "#f4f4f4",
      fontWeight: 'bold',
      fontSize: 16
  },
  changeText: {
      color: "#1ab65c",
      fontWeight: '600'
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#181a20",
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
    alignSelf: 'center',
  },
  confirmButton: {
    backgroundColor: "#1ab65c",
    height: 56,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1ab65c",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#1f222a",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1ab65c",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#1ab65c",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDesc: {
    color: "#f4f4f4",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: "#1ab65c",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
});