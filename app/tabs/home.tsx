import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, Image, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BellRingingIcon, BookmarkIcon, MagnifyingGlassIcon, SlidersHorizontalIcon, BedIcon, BathtubIcon } from "phosphor-react-native";
import { useRouter, useFocusEffect } from "expo-router";

// Firebase
import { db } from "../../firebaseConfig"; 
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Home() {
  const router = useRouter();
  
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setProperties(list);
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, [])
  );

  function handleDetails() {
      router.push("/stacks/details");
  }

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Pressable onPress={handleDetails} style={styles.cardButton}>
        <Image 
          style={styles.cardImage} 
          source={item.image ? { uri: item.image } : require("../assets/Room.jpg")}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardInfoTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardInfoSubTitle} numberOfLines={1}>{item.location}</Text>
          
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <BedIcon size={14} color="#757575" />
                <Text style={{ color: '#757575', fontSize: 12 }}>{item.bedrooms}</Text>
             </View>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <BathtubIcon size={14} color="#757575" />
                <Text style={{ color: '#757575', fontSize: 12 }}>{item.bathrooms}</Text>
             </View>
          </View>

        </View>
      </Pressable>

      <View style={styles.cardInfoBuy}>
        <Text style={styles.cardInfoBuyText}>
           R$ {item.price ? item.price.toLocaleString('pt-BR') : '0,00'}
        </Text>
        <BookmarkIcon size={30} color="#f4f4f4" weight="fill" />
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require("../assets/logo.png")} 
            style={styles.logoImage} 
          />
          <Text style={styles.headerLeftText}>Homefy</Text>
        </View>
        <View style={styles.headerRight}>
          {/* BOTÃO NOTIFICAÇÕES */}
          <TouchableOpacity onPress={() => router.push("/stacks/notifications")}>
             <BellRingingIcon size={30} color="#f4f4f4" weight="duotone" />
          </TouchableOpacity>

          {/* BOTÃO SALVOS (BOOKMARKS) */}
          <TouchableOpacity onPress={() => router.push("/stacks/bookmarks")}>
             <BookmarkIcon size={30} color="#f4f4f4" weight="duotone" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.userName}>Encontre seu Lar</Text>

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
        {loading ? (
            <ActivityIndicator size="large" color="#1ab65c" style={{ marginTop: 50 }} />
        ) : (
            <FlatList 
                data={properties}
                keyExtractor={(item) => item.id}
                renderItem={renderCard}
                contentContainerStyle={{ gap: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <Text style={{ color: '#757575', textAlign: 'center', marginTop: 50 }}>
                        Nenhum imóvel cadastrado ainda.
                    </Text>
                )}
            />
        )}
      </View>
    </View>
  );
}
 
export const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    backgroundColor: "#181a20",
    paddingHorizontal: 20,
    paddingTop: 20, 
  },
  header: {
    marginTop: 40, 
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15, // Aumentei um pouco o gap entre os ícones
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
    flex: 1, 
    width: "100%",
  },
  card: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "#1f222a",
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardButton: {
    flex: 1,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#333", 
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  cardInfoTitle: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "600",
  },
  cardInfoSubTitle: {
    color: "#757575",
    fontSize: 14,
    fontWeight: "300",
  },
  cardInfoBuy: {
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  cardInfoBuyText: {
    color: "#1ab65c",
    fontSize: 16, 
    fontWeight: "900",
  },
  logoImage: {
    width: 32,  
    height: 32,
    resizeMode: "contain", 
  },
});