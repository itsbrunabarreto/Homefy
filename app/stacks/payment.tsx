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
  PaypalLogo, 
  GoogleLogo, 
  AppleLogo, 
  CheckCircle,
  CalendarBlank
} from "phosphor-react-native";

// Firebase
import { auth, db } from "../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export default function Payment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");

  // 1. RECUPERA OS DADOS ENVIADOS DA TELA ANTERIOR
  // Se não vier nada (ex: teste direto), usa um fallback para não quebrar
  const property = params.data ? JSON.parse(params.data as string) : {
    id: "static_id",
    title: "Royale President Hotel",
    location: "Paris, France",
    price: 29,
    rating: 4.8,
    image: null 
  };

  // 2. CÁLCULO DE DATAS E PREÇOS (Dinâmico)
  // Simulando datas (Hoje + 5 dias)
  const today = new Date();
  const checkOutDate = new Date();
  checkOutDate.setDate(today.getDate() + 5);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const nights = 5;
  const pricePerNight = Number(property.price) || 0;
  const subtotal = pricePerNight * nights;
  const taxes = 15; // Taxa fixa ou porcentagem
  const total = subtotal + taxes;

  // 3. FUNÇÃO DE SALVAR NO BANCO
  async function handleConfirmPayment() {
    setLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Você precisa estar logado.");
        return;
      }

      // Cria a reserva no Firestore
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        propertyId: property.id,
        title: property.title,
        location: property.location,
        image: property.image, // Salva a URL/Base64 para exibir na lista depois
        price: total,
        status: "Ongoing", // Começa como "Em andamento"
        checkIn: formatDate(today),
        checkOut: formatDate(checkOutDate),
        paymentMethod: selectedMethod,
        createdAt: new Date().toISOString()
      });

      setShowSuccessModal(true);

    } catch (error: any) {
      Alert.alert("Erro no Pagamento", error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFinish() {
    setShowSuccessModal(false);
    // Volta para a Home e depois para a aba Booking para ver o ticket
    router.replace("/tabs/booking");
  }

  const renderPaymentMethod = (id: string, icon: React.ReactNode, label: string) => (
    <TouchableOpacity 
      style={styles.methodCard} 
      onPress={() => setSelectedMethod(id)}
      activeOpacity={0.7}
    >
      <View style={styles.methodLeft}>
        {icon}
        <Text style={styles.methodText}>{label}</Text>
      </View>
      
      {/* Radio Button */}
      <View style={[
        styles.radioButton, 
        selectedMethod === id && styles.radioButtonSelected
      ]}>
        {selectedMethod === id && <View style={styles.radioButtonInner} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#f4f4f4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* RESUMO DO HOTEL */}
        <View style={styles.summaryCard}>
          <Image 
            // Usa imagem do banco ou placeholder
            source={property.image ? { uri: property.image } : require("../assets/Room.jpg")} 
            style={styles.hotelImage} 
          />
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName} numberOfLines={1}>{property.title}</Text>
            <Text style={styles.hotelLocation} numberOfLines={1}>{property.location}</Text>
            <View style={styles.ratingRow}>
               <Text style={styles.ratingText}>⭐ {property.rating || 4.8} (Reviews)</Text>
            </View>
          </View>
          <View style={{ justifyContent: 'center' }}>
             <View style={styles.priceTag}>
                <Text style={styles.priceTagText}>${pricePerNight}</Text>
                <Text style={styles.priceTagUnit}>/night</Text>
             </View>
          </View>
        </View>

        {/* DATAS (Check-in / Check-out) */}
        <View style={styles.datesContainer}>
           <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Check in</Text>
              <Text style={styles.dateValue}>{formatDate(today)}</Text>
           </View>
           <View style={styles.dateDivider} />
           <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Check out</Text>
              <Text style={styles.dateValue}>{formatDate(checkOutDate)}</Text>
           </View>
        </View>

        <Text style={styles.sectionTitle}>Payment Methods</Text>

        {/* LISTA DE MÉTODOS */}
        <View style={styles.methodsList}>
          {renderPaymentMethod('paypal', <PaypalLogo size={24} color="#00457C" weight="fill" />, 'PayPal')}
          {renderPaymentMethod('google', <GoogleLogo size={24} color="#DB4437" weight="fill" />, 'Google Pay')}
          {renderPaymentMethod('apple', <AppleLogo size={24} color="#fff" weight="fill" />, 'Apple Pay')}
          {renderPaymentMethod('card', <CreditCard size={24} color="#1ab65c" weight="fill" />, '•••• •••• •••• 4679')}
        </View>

        {/* RESUMO DE PREÇOS */}
        <View style={styles.costContainer}>
           <View style={styles.costRow}>
              <Text style={styles.costLabel}>{nights} Nights</Text>
              <Text style={styles.costValue}>${subtotal.toFixed(2)}</Text>
           </View>
           <View style={styles.costRow}>
              <Text style={styles.costLabel}>Taxes & Fees</Text>
              <Text style={styles.costValue}>${taxes.toFixed(2)}</Text>
           </View>
           
           <View style={styles.divider} />
           
           <View style={styles.costRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
           </View>
        </View>

      </ScrollView>

      {/* BOTÃO CONFIRMAR */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.confirmButton, loading && { opacity: 0.7 }]} 
          onPress={handleConfirmPayment}
          disabled={loading}
        >
           {loading ? (
             <ActivityIndicator color="#fff" />
           ) : (
             <Text style={styles.confirmButtonText}>Confirm Payment - ${total.toFixed(2)}</Text>
           )}
        </TouchableOpacity>
      </View>

      {/* MODAL DE SUCESSO */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
              <View style={styles.successIcon}>
                 <CheckCircle size={48} color="#fff" weight="fill" />
              </View>
              
              <Text style={styles.modalTitle}>Payment Successful!</Text>
              <Text style={styles.modalDesc}>
                Successfully made payment and hotel booking!
              </Text>

              <TouchableOpacity style={styles.modalButton} onPress={handleFinish}>
                 <Text style={styles.modalButtonText}>View Ticket</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setShowSuccessModal(false)}>
                 <Text style={styles.cancelText}>Cancel</Text>
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f4f4f4",
  },
  
  // Hotel Summary
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
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#333"
  },
  hotelInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  hotelName: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "bold",
  },
  hotelLocation: {
    color: "#757575",
    fontSize: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "#1ab65c",
    fontSize: 12,
    fontWeight: "600",
  },
  priceTag: {
    alignItems: "flex-end",
  },
  priceTagText: {
    color: "#1ab65c",
    fontSize: 18,
    fontWeight: "bold",
  },
  priceTagUnit: {
    color: "#757575",
    fontSize: 12,
  },

  // Dates
  datesContainer: {
    flexDirection: "row",
    backgroundColor: "#1f222a",
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  dateBox: {
    flex: 1,
    alignItems: "center",
  },
  dateLabel: {
    color: "#757575",
    fontSize: 12,
    marginBottom: 4,
  },
  dateValue: {
    color: "#f4f4f4",
    fontWeight: "bold",
    fontSize: 15,
  },
  dateDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#333",
  },

  sectionTitle: {
    color: "#f4f4f4",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },

  // Methods
  methodsList: {
    gap: 16,
    marginBottom: 24,
  },
  methodCard: {
    backgroundColor: "#1f222a",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  methodText: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "600",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1ab65c",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#1ab65c",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1ab65c",
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
  costLabel: {
    color: "#757575",
    fontSize: 14,
  },
  costValue: {
    color: "#f4f4f4",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 12,
  },
  totalLabel: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    color: "#1ab65c",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Footer Button
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#181a20",
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1f222a",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
  },
  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
    marginBottom: 16,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelText: {
    color: "#757575",
    fontWeight: "600",
  },
});