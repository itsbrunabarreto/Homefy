import React, { useState, useEffect, useCallback } from "react";
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
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { 
  ArrowLeft, 
  CreditCard, 
  PaypalLogo, 
  GoogleLogo, 
  AppleLogo, 
  CheckCircle,
  Plus
} from "phosphor-react-native";

// Firebase
import { auth, db } from "../../firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";

export default function Payment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("paypal");
  const [fullData, setFullData] = useState<any>(null);
  
  const [userCards, setUserCards] = useState<any[]>([]);

  // 1. Carrega dados da reserva
  useEffect(() => {
    if (params.data) {
      setFullData(JSON.parse(params.data as string));
    }
  }, [params.data]);

  // 2. Busca cartões do Firestore
  useFocusEffect(
    useCallback(() => {
      const fetchCards = async () => {
        const user = auth.currentUser;
        if (!user) return;
        
        try {
          const querySnapshot = await getDocs(collection(db, "users", user.uid, "payment_methods"));
          const cardsList: any[] = [];
          querySnapshot.forEach((doc) => {
             cardsList.push({ id: doc.id, ...doc.data() });
          });
          setUserCards(cardsList);
        } catch (error) {
          console.log("Erro ao buscar cartões", error);
        }
      };
      fetchCards();
    }, [])
  );

  if (!fullData) {
    return <View style={styles.container}><ActivityIndicator color="#1ab65c" /></View>;
  }

  const { property, reservation, guestInfo } = fullData;

  // SALVAR NO BANCO
  async function handleConfirmPayment() {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Faça login.");
        return;
      }

      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        propertyId: property.id,
        title: property.title,
        location: property.location,
        image: property.image, 
        price: reservation.totalPrice,
        status: "Ongoing",
        
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        guestName: guestInfo.fullName,
        guestEmail: guestInfo.email,
        
        paymentMethod: selectedMethod,
        createdAt: new Date().toISOString()
      });

      setShowSuccessModal(true);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  }

  const renderPaymentMethod = (id: string, icon: React.ReactNode, label: string) => (
    <TouchableOpacity 
      style={styles.methodCard} 
      onPress={() => setSelectedMethod(id)}
    >
      <View style={styles.methodLeft}>
        {icon}
        <Text style={styles.methodText}>{label}</Text>
      </View>
      <View style={[styles.radioButton, selectedMethod === id && styles.radioButtonSelected]}>
        {selectedMethod === id && <View style={styles.radioButtonInner} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#f4f4f4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamento</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
           <Text style={styles.sectionTitle}>Métodos de Pagamento</Text>
           
           <TouchableOpacity onPress={() => router.push("/stacks/addNewCard")}>
              <Text style={styles.addNew}>Adicionar Cartão</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.methodsList}>
          {/* Métodos Padrão */}
          {renderPaymentMethod('paypal', <PaypalLogo size={24} color="#00457C" weight="fill" />, 'PayPal')}
          {renderPaymentMethod('google', <GoogleLogo size={24} color="#DB4437" weight="fill" />, 'Google Pay')}
          {renderPaymentMethod('apple', <AppleLogo size={24} color="#fff" weight="fill" />, 'Apple Pay')}
          
          {/* Cartões do Banco */}
          {userCards.map((card) => (
             renderPaymentMethod(
               card.id, 
               <CreditCard size={24} color="#1ab65c" weight="fill" />, 
               `•••• •••• •••• ${card.last4}`
             )
          ))}
        </View>

        <View style={styles.totalContainer}>
           <Text style={{color: '#757575'}}>Preço Total</Text>
           <Text style={styles.totalPrice}>
              R$ {reservation.totalPrice ? reservation.totalPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2}) : '0,00'}
           </Text>
        </View>

      </ScrollView>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirmar Pagamento</Text>}
      </TouchableOpacity>

      {/* Modal Sucesso */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
              <View style={styles.successIcon}><CheckCircle size={48} color="#fff" weight="fill" /></View>
              <Text style={styles.modalTitle}>Pagamento Realizado!</Text>
              <Text style={styles.modalDesc}>Reserva e pagamento realizados com sucesso!</Text>
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
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f4f4f4",
  },
  sectionTitle: {
    color: "#f4f4f4",
    fontSize: 18,
    fontWeight: "bold",
  },
  addNew: {
    color: "#1ab65c",
    fontWeight: "bold",
  },
  methodsList: {
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
  methodLeft: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
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
  totalContainer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 5
  },
  totalPrice: {
    color: "#f4f4f4",
    fontSize: 32,
    fontWeight: "bold"
  },
  confirmButton: {
    backgroundColor: "#1ab65c",
    height: 56,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
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
  },
});