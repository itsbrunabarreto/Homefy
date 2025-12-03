import React, { useState, useCallback } from "react";
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    ScrollView, 
    StyleSheet, 
    Modal,
    ActivityIndicator 
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

// Ícones
import { 
    BellIcon, 
    CreditCardIcon, 
    HouseIcon, 
    InfoIcon, 
    PencilSimpleIcon, 
    ShieldCheckIcon, 
    SignOutIcon,
    HouseLineIcon, // <--- NOVO ÍCONE PARA O ANÚNCIO
} from "phosphor-react-native";

// Firebase
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

import ProfileOption from "../components/ProfileOption";

export default function Profile() {
    const router = useRouter();
    
    // Estados
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Carrega dados toda vez que a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            const fetchUserData = async () => {
                const user = auth.currentUser;
                
                if (user) {
                    try {
                        const docRef = doc(db, "users", user.uid);
                        const docSnap = await getDoc(docRef);

                        if (docSnap.exists()) {
                            setUserData(docSnap.data());
                        }
                    } catch (error) {
                        console.error("Erro ao buscar perfil:", error);
                    } finally {
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                }
            };

            fetchUserData();
        }, [])
    );

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("/stacks/login");
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#1ab65c" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.headerTitle}>
                    <Image 
                        source={require("../assets/logo.png")} 
                        style={styles.logoImage} 
                    />
                    <Text style={styles.text}>Perfil</Text>
                </View>
            </View>

            {/* PROFILE CARD */}
            <View style={styles.profileContainer}>
                <View>
                    <Image 
                        source={{
                            uri: userData?.avatarUrl || auth.currentUser?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }}
                        style={styles.avatar}
                    />

                    <TouchableOpacity 
                        style={styles.editIcon}
                        onPress={() => router.push("/stacks/editProfile")}
                    >
                        <PencilSimpleIcon size={16} color="white" weight="bold" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.name}>
                    {userData?.fullName || auth.currentUser?.displayName || "Usuário"}
                </Text>

                <Text style={styles.email}>
                    {userData?.email || auth.currentUser?.email}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.optionsContainer}>
                
                {/* --- NOVO BOTÃO: ANUNCIAR IMÓVEL --- */}
                {/* Destaquei ele colocando como primeiro da lista */}
                <ProfileOption
                    icon={<HouseLineIcon size={20} color="#1ab65c" />} // Verde para chamar atenção
                    label="Anunciar meu Imóvel"
                    onPress={() => router.push("/stacks/addProperty")}
                />
                
                {/* Linha divisória opcional para separar ações de proprietário das configurações */}
                <View style={{ height: 1, backgroundColor: '#333', marginVertical: 10 }} />

                <ProfileOption
                    icon={<PencilSimpleIcon size={20} color="#fff" />}
                    label="Edit Profile"
                    onPress={() => router.push("/stacks/editProfile")}
                />

                <ProfileOption
                    icon={<CreditCardIcon size={20} color="#fff" />}
                    label="Payment"
                    onPress={() => {}}
                />

                <ProfileOption
                    icon={<BellIcon size={20} color="#fff" />}
                    label="Notifications"
                    onPress={() => router.push("/stacks/configNotifications")}
                />

                <ProfileOption
                    icon={<ShieldCheckIcon size={20} color="#fff" />}
                    label="Security"
                    onPress={() => router.push("/stacks/security")}
                />

                <ProfileOption
                    icon={<InfoIcon size={20} color="#fff" />}
                    label="Help"
                    onPress={() => {}}
                />

                {/* BOTÃO DE LOGOUT */}
                <TouchableOpacity 
                    style={styles.logoutRow} 
                    onPress={() => setShowLogoutModal(true)}
                >
                    <SignOutIcon size={20} color="red" />
                    <Text style={styles.logoutLabel}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* MODAL DE LOGOUT */}
            <Modal
                animationType="fade"
                transparent
                visible={showLogoutModal}
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Sair</Text>
                        <Text style={styles.modalSubtitle}>Tem Certeza que Deseja Sair?</Text>

                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleLogout}
                        >
                            <Text style={styles.confirmButtonText}>Sim, Sair</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowLogoutModal(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

// Styles mantidos iguais
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111827",
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    headerTitle: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    text:{
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
    },
    profileContainer: {
        alignItems: "center",
        marginTop: 24,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#34D399",
        padding: 6,
        borderRadius: 12,
    },
    name: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 12,
    },
    email: {
        color: "#A1A1AA",
        fontSize: 14,
    },
    optionsContainer: {
        paddingBottom: 80,
    },
    logoutRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 24,
    },
    logoutLabel: {
        color: "red",
        fontSize: 16,
        marginLeft: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#fff",
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#e63946",
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 15,
        color: "#333",
        marginBottom: 25,
        textAlign: "center",
    },
    confirmButton: {
        width: "100%",
        backgroundColor: "#2ecc71",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 10,
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    cancelButton: {
        width: "100%",
        backgroundColor: "#d1f5e0",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#2ecc71",
        fontSize: 16,
        fontWeight: "600",
    },
    logoImage: {
    width: 32,  
    height: 32,
    resizeMode: "contain", 
  },
});