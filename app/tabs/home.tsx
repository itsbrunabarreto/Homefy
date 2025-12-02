import { StyleSheet, Text, View, TextInput, Pressable, Image} from "react-native";
import {StatusBar} from "expo-status-bar";
import {HouseIcon, BellRingingIcon, BookmarkIcon, MagnifyingGlassIcon, SlidersHorizontalIcon } from "phosphor-react-native";
import { useRouter } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";

export default function Home() {
  const router = useRouter;
  
      function handleDetails() {
          navigate("/stacks/details");
      }
  
  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.header}>
      <View style={styles.headerLeft}>
        <HouseIcon size={30} color="#1ab65c" weight="duotone" />
        <Text style={styles.headerLeftText}>Homefy</Text>
      </View>
      <View style={styles.headerRight}>
        <BellRingingIcon size={30} color="#f4f4f4" weight="duotone" />
        <BookmarkIcon size={30} color="#f4f4f4" weight="duotone" />
      </View>
      </View>

      <Text  style={styles.userName}>Olá, Bruna</Text>

      <View style={styles.inputContainer}>
        <MagnifyingGlassIcon size={30} color="#757575" weight="duotone" />
        <TextInput 
          style={styles.input}
          placeholder="Busque uma casa aqui" 
          placeholderTextColor= "#757575" 
        />
        <SlidersHorizontalIcon size={30} color="#1ab65c" weight="duotone" />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Pressable onPress={handleDetails} style={styles.cardButton}>
            <Image 
              style={styles.cardImage} 
              source={require("../assets/Room.jpg")}
            />
            <View style={styles.cardInfo}>
              <Text  style={styles.cardInfoTitle}>Hotel Nova Vista</Text>
              <Text  style={styles.cardInfoSubTitle}>Santo André, São Paulo</Text>
            </View>
          </Pressable>

          <View style={styles.cardInfoBuy}>
            <Text  style={styles.cardInfoBuyText}>R$ 450,00</Text>

            <BookmarkIcon size={30} color="#f4f4f4" weight="fill" />
          </View>
        </View>
      </View>
    </View>
  );
}
 
export const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    backgroundColor: "#181a20",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  header: {
    marginTop:80,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: "10",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: "10",
  },
  headerLeftText: {
    color: "#f4f4f4",
    fontSize: 24,
    fontWeight: "800",
  },
  userName: {
    paddingTop: 30,
    paddingBottom: 30,
    color: "#f4f4f4",
    fontSize: 25,
    fontWeight: "800",
  },

  inputContainer: {
    width: "100%",
    height: 56,
    backgroundColor: "#1f222a",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    color: "#f4f4f4",
  },

  content: {
    width: "100%",
    gap: 20,

  },

  card: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "#1f222a",
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },

  cardButton: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
  },

  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },

  cardInfo: {
    height: "100%",
    gap: 10,
  },

  cardInfoTitle: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "400",
  },

  cardInfoSubTitle: {
    color: "#f4f4f4",
    fontSize: 14,
    fontWeight: "300",
  },

  cardInfoBuy: {
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  cardInfoBuyText: {
    color: "#1ab65c",
    fontSize: 18,
    fontWeight: "900",
  },
});