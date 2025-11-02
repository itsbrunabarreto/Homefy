import { Stack } from "expo-router";
import {Text, View} from "react-native";

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name= "login" />
            <Stack.Screen name= "signup" />
        </Stack>
    );
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",

    }
});