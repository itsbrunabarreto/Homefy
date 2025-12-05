import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { 
  ArrowLeftIcon,
  EnvelopeSimpleIcon,
  LockKeyIcon,
  FacebookLogoIcon,
  GoogleLogoIcon
} from "phosphor-react-native";

import { auth } from "../../firebaseConfig";

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleSignUp() {
    if (!email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      router.push("/stacks/userDetails"); 
    }catch (error: any) {
  console.log(error);
  alert(error.message);
}
  }

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.header}
        onPress={() => router.back()}
      >
        <ArrowLeftIcon size={32} color="#f4f4f4" weight="regular" />
      </TouchableOpacity>

      <Text style={styles.title}>Crie sua Conta</Text>

      <View style={styles.content}>
        <View style={styles.contentInput}>
          <EnvelopeSimpleIcon size={28} color="#757575" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#757575"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.contentInput}>
          <LockKeyIcon size={28} color="#757575" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#757575"
            secureTextEntry
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <View style={styles.rememberContainer}>
          <View style={styles.checkbox} />
          <Text style={styles.rememberText}>Lembre de mim</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.buttonSignUp} onPress={handleSignUp}>
        <Text style={styles.buttonSignUpText}>Cadastrar</Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>Continuar com</Text>
        <View style={styles.separator} />
      </View>

      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.footerButton}>
          <GoogleLogoIcon size={30} weight="fill" color="#1ab55c" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
          <FacebookLogoIcon size={30} weight="fill" color="#1ab55c" />
        </TouchableOpacity>
      </View>

      <View style={styles.footerBottom}>
        <Text style={styles.footerText}>Já possui uma conta?</Text>
        <TouchableOpacity onPress={() => router.push("/stacks/login")}>
          <Text style={styles.footerLink}>Login</Text>
        </TouchableOpacity>
      </View>

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
    marginTop: 40,
    fontSize: 32,
    fontWeight: "600",
  },

  content: {
    width: "100%",
    marginTop: 40,
    gap: 22,
  },

  contentInput: {
    width: "100%",
    height: 56,
    backgroundColor: "#1f222a",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
  },

  input: {
    flex: 1,
    color: "#f4f4f4",
  },

  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: -10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#1ab55c",
  },

  rememberText: {
    color: "#f4f4f4",
    fontSize: 14,
  },

  buttonSignUp: {
    backgroundColor: "#1ab55c",
    width: "100%",
    height: 56,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },

  buttonSignUpText: {
    color: "#f4f4f4",
    fontSize: 18,
    fontWeight: "800",
  },

  separatorContainer: {
    marginTop: 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  separator: {
    height: 1,
    flex: 1,
    backgroundColor: "#757575",
  },

  separatorText: {
    color: "#f4f4f4",
    fontSize: 14,
  },

  footerButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 40,
  },

  footerButton: {
    width: 100,
    height: 60,
    backgroundColor: "#1f222a",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },

  footerBottom: {
    flexDirection: "row",
    marginTop: 50,
    gap: 6,
  },

  footerText: {
    color: "#f4f4f4",
  },

  footerLink: {
    color: "#1ab55c",
  },
});
