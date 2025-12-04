import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "phosphor-react-native";

// Firebase
import { auth, db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function AddNewCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados do Formulário
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Formatação do Número do Cartão
  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    if (cleaned.length <= 16) setCardNumber(formatted);
  };

  // Formatação da Validade (MM/AA)
  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
       setExpiryDate(cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4));
    } else {
       setExpiryDate(cleaned);
    }
  };

  async function handleSaveCard() {
    // Validação simples
    if (cardName.length < 3 || cardNumber.length < 16 || expiryDate.length < 5 || cvv.length < 3) {
      Alert.alert("Atenção", "Preencha os dados do cartão corretamente.");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) return;

      // Salva apenas os 4 últimos dígitos por segurança
      const last4 = cardNumber.replace(/\s/g, '').slice(-4);
      
      await addDoc(collection(db, "users", user.uid, "payment_methods"), {
        type: "card",
        cardName,
        last4: last4, 
        expiryDate,
        brand: "mastercard", // Simplificação
        createdAt: new Date().toISOString()
      });

      Alert.alert("Sucesso", "Cartão adicionado!");
      router.back(); // Volta para a tela anterior

    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível salvar o cartão.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#f4f4f4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Cartão</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Visual do Cartão (Preview) */}
      <View style={styles.cardPreview}>
         <View style={styles.cardBg}>
            <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Saldo</Text>
                <Text style={styles.cardBrand}>VISA</Text>
            </View>
            <Text style={styles.cardBalance}>R$ 0,00</Text>
            
            <View style={{flex: 1}} />

            <View style={styles.cardRow}>
               <Text style={styles.cardNumberPreview}>{cardNumber || "**** **** **** ****"}</Text>
            </View>

            <View style={[styles.cardRow, {marginTop: 15}]}>
               <View>
                  <Text style={styles.cardLabelSmall}>TITULAR</Text>
                  <Text style={styles.cardValueSmall}>{cardName.toUpperCase() || "SEU NOME"}</Text>
               </View>
               <View>
                  <Text style={styles.cardLabelSmall}>VALIDADE</Text>
                  <Text style={styles.cardValueSmall}>{expiryDate || "MM/AA"}</Text>
               </View>
            </View>
         </View>
      </View>

      {/* Formulário */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
           <Text style={styles.label}>Nome no Cartão</Text>
           <TextInput 
             style={styles.input} 
             placeholder="Nome como está no cartão" 
             placeholderTextColor="#555"
             value={cardName}
             onChangeText={setCardName}
           />
        </View>

        <View style={styles.inputGroup}>
           <Text style={styles.label}>Número do Cartão</Text>
           <TextInput 
             style={styles.input} 
             placeholder="0000 0000 0000 0000" 
             placeholderTextColor="#555"
             keyboardType="numeric"
             maxLength={19}
             value={cardNumber}
             onChangeText={handleCardNumberChange}
           />
        </View>

        <View style={styles.row}>
           <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Validade</Text>
              <TextInput 
                style={styles.input} 
                placeholder="MM/AA" 
                placeholderTextColor="#555"
                keyboardType="numeric"
                maxLength={5}
                value={expiryDate}
                onChangeText={handleExpiryChange}
              />
           </View>
           <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput 
                style={styles.input} 
                placeholder="123" 
                placeholderTextColor="#555"
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                value={cvv}
                onChangeText={setCvv}
              />
           </View>
        </View>
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSaveCard}
        disabled={loading}
      >
        {loading ? (
            <ActivityIndicator color="#fff"/>
        ) : (
            <Text style={styles.saveButtonText}>Adicionar Cartão</Text>
        )}
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
  // Estilos do Cartão Visual
  cardPreview: {
    alignItems: 'center',
    marginBottom: 30,
  },
  cardBg: {
    width: '100%',
    height: 200,
    backgroundColor: '#1ab65c', // Verde do tema
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between'
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  cardBrand: { color: '#fff', fontWeight: 'bold', fontSize: 16, fontStyle: 'italic' },
  cardBalance: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  cardNumberPreview: { color: '#fff', fontSize: 20, letterSpacing: 2, fontWeight: '600' },
  cardLabelSmall: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginBottom: 2 },
  cardValueSmall: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  
  // Formulário
  form: {
    gap: 15,
  },
  inputGroup: {
    marginBottom: 5,
  },
  label: {
    color: "#f4f4f4",
    marginBottom: 8,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#1f222a",
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    color: "#f4f4f4",
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: "#1ab65c",
    height: 56,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});