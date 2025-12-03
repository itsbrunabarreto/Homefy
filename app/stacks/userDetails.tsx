import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image 
} from "react-native";

import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

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

  async function handleSelectImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [1, 1],
      allowsEditing: true,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  }

  function handleContinue() {
    if (!fullName || !nickname || !birthDate) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    router.push("/tabs/home");
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

      <TouchableOpacity style={styles.buttonContinue} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
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
