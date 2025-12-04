import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, Image, FlatList, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BellRingingIcon, BookmarkIcon, MagnifyingGlassIcon, SlidersHorizontalIcon, BedIcon, BathtubIcon } from "phosphor-react-native";
import { useRouter, useFocusEffect } from "expo-router";

// Firebase
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs, query, orderBy, addDoc, where, deleteDoc, doc } from "firebase/firestore";

export default function Home() {
  const router = useRouter();
  
  const [properties, setProperties] = useState<any[]>([]);
  // Novo estado para saber QUAIS imóveis estão favoritados (lista de IDs)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // 1. Busca os imóveis (Produtos)
  const fetchProperties = async () => {
    try {
      const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
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

  // 2. Busca quais desses o usuário já salvou (Favoritos)
  const fetchUserBookmarks = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(collection(db, "bookmarks"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      // Cria uma lista apenas com os IDs dos imóveis salvos
      // Nota: assumindo que no bookmark você salvou o ID do imóvel no campo 'id' ou 'propertyId'
      // No código anterior usamos ...item, então o ID do imóvel veio como 'id'
      const ids = querySnapshot.docs.map(doc => doc.data().id);
      setBookmarkedIds(ids);
    } catch (error) {
      console.error("Erro ao buscar bookmarks:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
      fetchUserBookmarks();
    }, [])
  );

  function handleDetails(item: any) {
      router.push({
        pathname: "/stacks/details",
        params: { data: JSON.stringify(item) } 
      });
  }

  // --- FUNÇÃO INTELIGENTE DE TOGGLE (Salvar/Remover) ---
  async function handleToggleBookmark(item: any) {
    const user = auth.currentUser;
    
    if (!user) {
      Alert.alert("Atenção", "Faça login para salvar favoritos.");
      return;
    }

    // Verifica se já está salvo olhando nosso estado local
    const isAlreadySaved = bookmarkedIds.includes(item.id);

    try {
      if (isAlreadySaved) {
        // --- REMOVER ---
        // 1. Atualiza visualmente na hora (Optimistic Update)
        setBookmarkedIds(prev => prev.filter(id => id !== item.id));

        // 2. Busca o documento exato no banco para deletar
        // Precisamos fazer uma query para achar o bookmark que tem esse userId e esse imóvel
        const q = query(
            collection(db, "bookmarks"), 
            where("userId", "==", user.uid),
            where("id", "==", item.id) 
        );
        const snapshot = await getDocs(q);
        
        // Deleta todos que encontrar (deveria ser só 1)
        snapshot.forEach(async (d) => {
            await deleteDoc(doc(db, "bookmarks", d.id));
        });

      } else {
        // --- SALVAR ---
        // 1. Atualiza visualmente na hora
        setBookmarkedIds(prev => [...prev, item.id]);

        // 2. Salva no banco
        await addDoc(collection(db, "bookmarks"), {
          userId: user.uid,
          ...item, // Salva todos os dados para facilitar a exibição na tela de Bookmarks
          savedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error(error);
      // Se der erro, reverta o estado visual (opcional)
      Alert.alert("Erro", "Falha ao atualizar favoritos.");
    }
  }

  const filteredProperties = properties.filter(item => 
    item.title.toLowerCase().includes(searchText.toLowerCase()) || 
    item.location.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderCard = ({ item }) => {
    // Verifica se este item específico está na lista de salvos
    const isSaved = bookmarkedIds.includes(item.id);

    return (
      <View style={styles.card}>
        <Pressable onPress={() => handleDetails(item)} style={styles.cardButton}>
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
          
          {/* BOTÃO DE FAVORITAR COM LÓGICA VISUAL */}
          <TouchableOpacity onPress={() => handleToggleBookmark(item)}>
              <BookmarkIcon 
                size={30} 
                // Se estiver salvo: Verde + Preenchido (weight="fill")
                // Se não: Branco + Contorno (weight="duotone" ou "regular")
                color={isSaved ? "#1ab65c" : "#f4f4f4"} 
                weight={isSaved ? "fill" : "duotone"} 
              />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
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
          <TouchableOpacity onPress={() => router.push("/stacks/notifications")}>
             <BellRingingIcon size={30} color="#f4f4f4" weight="duotone" />
          </TouchableOpacity>

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
          value={searchText}
          onChangeText={setSearchText}
        />
        <SlidersHorizontalIcon size={30} color="#1ab65c" weight="duotone" />
      </View>

      <View style={styles.content}>
        {loading ? (
            <ActivityIndicator size="large" color="#1ab65c" style={{ marginTop: 50 }} />
        ) : (
            <FlatList 
                data={filteredProperties} 
                keyExtractor={(item) => item.id}
                renderItem={renderCard}
                contentContainerStyle={{ gap: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <Text style={{ color: '#757575', textAlign: 'center', marginTop: 50 }}>
                        {searchText.length > 0 
                          ? "Nenhum imóvel encontrado para essa busca." 
                          : "Nenhum imóvel cadastrado ainda."}
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
    gap: 15, 
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