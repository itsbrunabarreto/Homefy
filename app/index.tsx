import { StyleSheet, Text, View, TextInput} from "react-native";
import {StatusBar} from "expo-status-bar";
import {HouseIcon, BellRingingIcon, BookmarkIcon, MagnifyingGlassIcon, SlidersHorizontalIcon } from "phosphor-react-native";

export default function Index() {
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


    </View>
  );
}
 
export const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    backgroundColor: "#181a20",
    paddingHorizontal: 20,
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
});