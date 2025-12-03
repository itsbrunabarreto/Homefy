import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Alert,
  ActivityIndicator 
} from "react-native";

import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";


import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

import {
  ArrowLeftIcon,
  UserCircleIcon,
  CalendarDotsIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  CaretDownIcon,
  PencilSimpleLineIcon
} from "phosphor-react-native";

export default function UserDetails() {
  const router = useRouter();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");

  // Estado para controlar o carregamento
  const [loading, setLoading] = useState(false);

  // Preencher email automaticamente se já estiver logado
  useEffect(() => {
    if (auth.currentUser?.email) {
      setEmail(auth.currentUser.email);
    }
  }, []);

  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        // IMPORTANTE: Qualidade baixa (0.2) para a string base64 não ficar gigante
        quality: 0.2, 
        // IMPORTANTE: Pedimos o base64 para salvar como texto
        base64: true, 
      });

      if (!result.canceled && result.assets[0].base64) {
        // Montamos o prefixo necessário para o componente Image ler o texto como imagem
        const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setProfileImage(imageUri);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  }

  async function handleContinue() {
    // Validação básica
    if (!fullName || !nickname || !birthDate) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios (Nome, Apelido, Data).");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      // Prepara o objeto para salvar no banco
      const userData = {
        uid: user.uid,
        fullName,
        nickname,
        birthDate,
        email,
        phoneNumber,
        gender,
        // Aqui salvamos o TEXTO da imagem direto no banco. 
        // Se o usuário não escolheu foto, enviamos null.
        avatarUrl: profileImage || null, 
        createdAt: new Date().toISOString(),
      };

      // Salva no Firestore na coleção "users" com o ID do usuário
      await setDoc(doc(db, "users", user.uid), userData);

      // Sucesso
      router.push("/tabs/home");

    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      
      // Se o erro for sobre tamanho (quota/size), avisamos o usuário
      if (error.message && error.message.includes("exceeds the maximum allowed size")) {
        Alert.alert("Imagem muito grande", "A foto selecionada é muito pesada para este método. Tente uma foto mais simples.");
      } else {
        Alert.alert("Erro", "Não foi possível salvar os dados: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.header} onPress={() => router.back()}>
        <ArrowLeftIcon size={32} color="#f4f4f4" />
      </TouchableOpacity>

      <Text style={styles.title}>Fill Your Profile</Text>

      {/* FOTO DO USUÁRIO */}
      <View style={styles.photoContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.photo} />
        ) : (
          <UserCircleIcon size={120} color="#757575" weight="light" />
        )}

        <TouchableOpacity style={styles.photoEdit} onPress={handleSelectImage}>
          <PencilSimpleLineIcon size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* CAMPOS */}
      <View style={styles.form}>

        <View style={styles.inputBox}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#757575"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputBox}>
          <TextInput
            placeholder="Nickname"
            placeholderTextColor="#757575"
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
          />
        </View>

        <View style={styles.inputIconBox}>
          <TextInput
            placeholder="Date of Birth"
            placeholderTextColor="#757575"
            style={styles.input}
            value={birthDate}
            onChangeText={setBirthDate}
          />
          <CalendarDotsIcon size={24} color="#757575" />
        </View>

        <View style={styles.inputIconBox}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#757575"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={false} // Email vem do login, melhor não editar
          />
          <EnvelopeSimpleIcon size={24} color="#757575" />
        </View>

        <View style={styles.inputIconBox}>
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#757575"
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <PhoneIcon size={24} color="#757575" />
        </View>

        <View style={styles.inputIconBox}>
          <TextInput
            placeholder="Gender"
            placeholderTextColor="#757575"
            style={styles.input}
            value={gender}
            onChangeText={setGender}
          />
          <CaretDownIcon size={24} color="#757575" />
        </View>

      </View>

      <TouchableOpacity 
        style={[styles.buttonContinue, loading && { opacity: 0.7 }]} 
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
    paddingHorizontal: 22,
    alignItems: "center",
  },

  header: {
    alignSelf: "flex-start",
    marginTop: 50,
  },

  title: {
    color: "#f4f4f4",
    fontSize: 28,
    fontWeight: "600",
    marginTop: 20,
  },

  photoContainer: {
    marginTop: 40,
    alignItems: "center",
  },

  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  photoEdit: {
    backgroundColor: "#1ab55c",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: -2,
    bottom: -2,
  },

  form: {
    width: "100%",
    marginTop: 40,
    gap: 20,
  },

  inputBox: {
    height: 56,
    backgroundColor: "#1f222a",
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  inputIconBox: {
    height: 56,
    backgroundColor: "#1f222a",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },

  input: {
    flex: 1,
    color: "#f4f4f4",
    marginRight: 10,
  },

  buttonContinue: {
    backgroundColor: "#1ab55c",
    width: "100%",
    height: 56,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },

  buttonText: {
    color: "#f4f4f4",
    fontSize: 18,
    fontWeight: "800",
  },
});