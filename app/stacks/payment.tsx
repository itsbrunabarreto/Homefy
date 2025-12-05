import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
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
  QrCode, // Ícone para o PIX
  PlusCircle
} from "phosphor-react-native";

// Firebase
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Payment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [selectedMethodId, setSelectedMethodId] = useState("pix"); // Pix como padrão ou o que preferir
  const [selectedMethodData, setSelectedMethodData] = useState<any>({ type: 'pix', label: 'Pix Instantâneo' });
  
  const [fullData, setFullData] = useState<any>(null);
  const [userCards, setUserCards] = useState<any[]>([]);

  // 1. Carrega dados da reserva vindos da tela anterior
  useEffect(() => {
    if (params.data) {
      setFullData(JSON.parse(params.data as string));
    }
  }, [params.data]);

  // 2. Busca cartões salvos no Firestore
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
        } finally {
          setLoading(false);
        }
      };
      fetchCards();
    }, [])
  );

  if (!fullData) {
    return <View style={styles.container}><ActivityIndicator color="#1ab65c" /></View>;
  }

  const handleContinue = () => {
    // Envia TUDO (dados da reserva + método escolhido) para a tela de Confirmação
    const dataToPass = {
        ...fullData,
        paymentMethod: selectedMethodData
    };

    router.push({
        pathname: "/stacks/confirmPayment",
        params: { data: JSON.stringify(dataToPass) }
    });
  };

  const selectMethod = (id: string, data: any) => {
      setSelectedMethodId(id);
      setSelectedMethodData(data);
  }

  const renderMethodItem = (id: string, icon: React.ReactNode, label: string, type: string) => (
    <TouchableOpacity 
      style={styles.methodCard} 
      onPress={() => selectMethod(id, { id, label, type })}
      activeOpacity={0.7}
    >
      <View style={styles.methodLeft}>
        {icon}
        <Text style={styles.methodText}>{label}</Text>
      </View>
      <View style={[styles.radioButton, selectedMethodId === id && styles.radioButtonSelected]}>
        {selectedMethodId === id && <View style={styles.radioButtonInner} />}
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
        
        <View style={styles.sectionRow}>
           <Text style={styles.sectionTitle}>Métodos de Pagamento</Text>
           <TouchableOpacity 
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}
                onPress={() => router.push("/stacks/addNewCard")}
           >
              <PlusCircle size={20} color="#1ab65c" />
              <Text style={styles.addNew}>Novo Cartão</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.methodsList}>
          {/* PIX */}
          {renderMethodItem('pix', <QrCode size={24} color="#1ab65c" />, 'Pix (Aprovação Imediata)', 'pix')}

          {/* Carteiras Digitais */}
          {renderMethodItem('paypal', <PaypalLogo size={24} color="#00457C" weight="fill" />, 'PayPal', 'wallet')}
          {renderMethodItem('google', <GoogleLogo size={24} color="#DB4437" weight="fill" />, 'Google Pay', 'wallet')}
          {renderMethodItem('apple', <AppleLogo size={24} color="#fff" weight="fill" />, 'Apple Pay', 'wallet')}
          
          {/* Cartões Salvos do Banco */}
          {userCards.map((card) => (
             renderMethodItem(
               card.id, 
               <CreditCard size={24} color="#1ab65c" weight="fill" />, 
               `•••• •••• •••• ${card.last4}`,
               'card'
             )
          ))}
        </View>

      </ScrollView>

      <TouchableOpacity style={styles.confirmButton} onPress={handleContinue}>
         <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>

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
  sectionRow: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: 20 
  },
  sectionTitle: {
    color: "#f4f4f4",
    fontSize: 18,
    fontWeight: "bold",
  },
  addNew: {
    color: "#1ab65c",
    fontWeight: "bold",
    fontSize: 14
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
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#1ab65c",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#1ab65c",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1ab65c",
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
});