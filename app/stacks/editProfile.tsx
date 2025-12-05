import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Alert,
  ActivityIndicator,
  ScrollView
} from "react-native";

import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

// Firebase
import { auth, db } from "../../firebaseConfig";

import { doc, getDoc, setDoc } from "firebase/firestore";

// Ícones
import {
  ArrowLeftIcon,
  UserCircleIcon,
  CalendarDotsIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  CaretDownIcon,
  PencilSimpleLineIcon
} from "phosphor-react-native";

export default function EditProfile() {
  const router = useRouter();

  // Estados para os campos
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState(""); 
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Carregar dados atuais ao abrir a tela
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullName(data.fullName || "");
          setNickname(data.nickname || "");
          setBirthDate(data.birthDate || "");
          setEmail(data.email || user.email || "");
          setPhoneNumber(data.phoneNumber || "");
          setGender(data.gender || "");
          setProfileImage(data.avatarUrl || null);
        } else {
          // Se não existir documento, preenchemos o email pelo Auth
          setEmail(user.email || "");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar seus dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2, 
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setProfileImage(imageUri);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao selecionar imagem.");
    }
  }


  async function handleUpdate() {
    // Validação
    if (!fullName || !nickname || !birthDate) {
      Alert.alert("Atenção", "Nome, Apelido e Data são obrigatórios.");
      return;
    }

    setSaving(true);

    try {
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert("Erro", "Sessão inválida. Faça login novamente.");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);

      await setDoc(userDocRef, {
        fullName,
        nickname,
        birthDate,
        phoneNumber,
        gender,
        avatarUrl: profileImage,
        email: email,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      Alert.alert("Sucesso", "Perfil atualizado!");
      router.back(); 

    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      
      if (error.message && error.message.includes("size")) {
        Alert.alert("Erro", "A imagem selecionada é muito grande.");
      } else {
        Alert.alert("Erro", "Falha ao atualizar: " + error.message);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#1ab55c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon size={28} color="#f4f4f4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* FOTO */}
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

        {/* FORMULÁRIO */}
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

          {/* EMAIL (Bloqueado visualmente) */}
          <View style={[styles.inputIconBox, { opacity: 0.5 }]}> 
            <TextInput
              value={email}
              style={styles.input}
              editable={false}
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

        {/* BOTÃO SALVAR */}
        <TouchableOpacity 
          style={[styles.buttonUpdate, saving && { opacity: 0.7 }]} 
          onPress={handleUpdate}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Update</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    paddingHorizontal: 22,
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#f4f4f4",
    fontSize: 20,
    fontWeight: "bold",
  },
  photoContainer: {
    alignItems: "center",
    marginTop: 10,
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
    right: 100, 
    bottom: 0,
    transform: [{ translateX: 50 }], 
  },
  form: {
    width: "100%",
    marginTop: 30,
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
    fontSize: 16,
  },
  buttonUpdate: {
    backgroundColor: "#1ab55c",
    width: "100%",
    height: 56,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  buttonText: {
    color: "#f4f4f4",
    fontSize: 18,
    fontWeight: "800",
  },
});