import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, EnvelopeSimple, Phone, CalendarBlank } from "phosphor-react-native";

export default function NameReservation() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Dados vindos da tela anterior
  const previousData = params.data ? JSON.parse(params.data as string) : {};

  // Estados do Formulário
  const [gender, setGender] = useState("Mr.");
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleContinue = () => {
    if (!fullName || !email || !phone) {
      Alert.alert("Erro", "Preencha nome, email e telefone.");
      return;
    }

    // Acumula os dados anteriores + dados pessoais
    const finalData = {
      ...previousData,
      guestInfo: {
        title: gender,
        fullName,
        nickname,
        dob,
        email,
        phone
      }
    };

    router.push({
      pathname: "/stacks/payment",
      params: { data: JSON.stringify(finalData) }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#f4f4f4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nome na Reserva</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Gender Selection */}
        <View style={styles.genderRow}>
          {["Mr.", "Mrs.", "Ms."].map((title) => (
            <TouchableOpacity 
              key={title} 
              style={[styles.genderButton, gender === title && styles.genderActive]}
              onPress={() => setGender(title)}
            >
              <Text style={[styles.genderText, gender === title && styles.genderTextActive]}>
                {title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Inputs */}
        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input} 
            placeholder="Full Name" 
            placeholderTextColor="#757575"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input} 
            placeholder="Nickname" 
            placeholderTextColor="#757575"
            value={nickname}
            onChangeText={setNickname}
          />
        </View>

        <View style={styles.inputGroupIcon}>
          <TextInput 
            style={styles.inputFlex} 
            placeholder="Date of Birth" 
            placeholderTextColor="#757575"
            value={dob}
            onChangeText={setDob}
          />
          <CalendarBlank size={24} color="#757575" />
        </View>

        <View style={styles.inputGroupIcon}>
          <TextInput 
            style={styles.inputFlex} 
            placeholder="Email" 
            placeholderTextColor="#757575"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <EnvelopeSimple size={24} color="#757575" />
        </View>

        <View style={styles.inputGroupIcon}>
          <TextInput 
            style={styles.inputFlex} 
            placeholder="Phone Number" 
            placeholderTextColor="#757575"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Phone size={24} color="#757575" />
        </View>

      </ScrollView>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
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
  content: {
    gap: 20,
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#1ab65c",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  genderActive: {
    backgroundColor: "#1ab65c",
  },
  genderText: {
    color: "#1ab65c",
    fontWeight: "600",
  },
  genderTextActive: {
    color: "#fff",
  },
  inputGroup: {
    backgroundColor: "#1f222a",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  inputGroupIcon: {
    backgroundColor: "#1f222a",
    height: 56,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  input: {
    color: "#f4f4f4",
    fontSize: 16,
  },
  inputFlex: {
    flex: 1,
    color: "#f4f4f4",
    fontSize: 16,
  },
  continueButton: {
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