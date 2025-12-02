
import { BellIcon, CreditCardIcon, EyeIcon, HouseIcon, InfoIcon, PencilSimpleIcon, ShieldCheckIcon, SignOutIcon } from "phosphor-react-native";
import {View, Text, Image, TouchableOpacity, Switch, ScrollView, StyleSheet} from "react-native";
import ProfileOption from "../components/ProfileOption";

export default function Profile() {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitle}>
                    <HouseIcon size={30} color="#1ab65c" weight="duotone" />
                    <Text style={styles.text}>Perfil</Text>
                </View>
            </View>
            <View style={styles.profileContainer}>
                <View>
                    <Image source={{ uri: "https://i.pinimg.com/1200x/c2/65/e5/c265e50d2d0ee2e666eabb6dc2ec8410.jpg" }} style={styles.avatar} />
                     <TouchableOpacity style={styles.editIcon}>
                        <PencilSimpleIcon size={16} color="white" weight="bold" />
                     </TouchableOpacity>
                </View>

                <Text style={styles.name}>Bruna Barreto</Text>
                <Text style={styles.email}>bruna@gmail.com</Text>
            </View>

            <ScrollView contentContainerStyle={styles.optionsContainer}>
                <ProfileOption
                    icon={<PencilSimpleIcon size={20} color="#fff" />}
                    label="Edit Profile"
                    onPress={() => {}}
                />
                <ProfileOption
                    icon={<CreditCardIcon size={20} color="#fff" />}
                    label="Payment"
                    onPress={() => {}}
                />
                <ProfileOption
                    icon={<BellIcon size={20} color="#fff" />}
                    label="Notifications"
                    onPress={() => {}}
                />
                <ProfileOption
                    icon={<ShieldCheckIcon size={20} color="#fff" />}
                    label="Security"
                    onPress={() => {}}
                />
                <ProfileOption icon={<InfoIcon size={20} color="#fff" />} label="Help" onPress={() => {}} />

               

                <TouchableOpacity style={styles.logoutRow} onPress={() => {}}>
                    <SignOutIcon size={20} color="red" />
                    <Text style={styles.logoutLabel}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
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
    profileContainer: {
        alignItems: "center",
        marginTop: 24,
    },
    text:{
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
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
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2D2D2D",
    },
    optionLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    optionLabel: {
        color: "#FFFFFF",
        fontSize: 16,
        marginLeft: 12,
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
})