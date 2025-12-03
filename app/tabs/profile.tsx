import { 
    BellIcon, 
    CreditCardIcon, 
    EyeIcon, 
    HouseIcon, 
    InfoIcon, 
    PencilSimpleIcon, 
    ShieldCheckIcon, 
    SignOutIcon 
} from "phosphor-react-native";

import { useRouter } from "expo-router";
import React, { useState } from "react";

import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    ScrollView, 
    StyleSheet, 
    Modal 
} from "react-native";

import { auth } from "../../firebaseConfig";  
import ProfileOption from "../components/ProfileOption";


export default function Profile() {

    const user = auth.currentUser;
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    return (
        <View style={styles.container}>
            
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.headerTitle}>
                    <HouseIcon size={30} color="#1ab65c" weight="duotone" />
                    <Text style={styles.text}>Perfil</Text>
                </View>
            </View>

            {/* PROFILE CARD */}
            <View style={styles.profileContainer}>
                <View>
                    <Image 
                        source={{
                            uri: user?.photoURL 
                                || "https://i.pinimg.com/1200x/c2/65/e5/c265e50d2d0ee2e666eabb6dc2ec8410.jpg"
                        }}
                        style={styles.avatar}
                    />

                    <TouchableOpacity style={styles.editIcon}>
                        <PencilSimpleIcon size={16} color="white" weight="bold" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.name}>
                    {user?.displayName || "Seu nome"}
                </Text>

                <Text style={styles.email}>
                    {user?.email}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.optionsContainer}>
                
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
                    onPress={() => router.push("/stacks/notifications")}
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

            <Modal
                animationType="fade"
                transparent
                visible={showLogoutModal}
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        
                        <Text style={styles.modalTitle}>Sair</Text>

                        <Text style={styles.modalSubtitle}>
                            Tem Certeza que Deseja Sair?
                        </Text>

                        {/* CONFIRMAR */}
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={async () => {
                                router.replace("/stacks/login");
                            }}
                        >
                            <Text style={styles.confirmButtonText}>Sim, Sair</Text>
                        </TouchableOpacity>

                        {/* CANCELAR */}
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

    // MODAL
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
});
