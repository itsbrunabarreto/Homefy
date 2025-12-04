import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

// Ícones
import { 
  ArrowLeftIcon, 
  StarIcon, 
  BookmarkIcon, 
  SquaresFourIcon, 
  ListIcon,
  SmileySad // Caso não funcione, troque por StarIcon
} from "phosphor-react-native";

// Firebase
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

export default function Bookmarks() {
  const router = useRouter();

  const [isGrid, setIsGrid] = useState(true);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "bookmarks"), 
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      
      querySnapshot.forEach((doc) => {
        // O segredo está aqui: bookmarkId é o ID do documento que vamos apagar
        list.push({ bookmarkId: doc.id, ...doc.data() });
      });

      setBookmarks(list);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [])
  );

  // --- FUNÇÃO DE REMOVER ---
  async function handleRemoveBookmark(bookmarkId: string) {
    console.log("Tentando remover ID:", bookmarkId); // Debug

    if (!bookmarkId) {
        Alert.alert("Erro", "ID do favorito inválido.");
        return;
    }

    Alert.alert(
      "Remover",
      "Deseja tirar este item dos favoritos?",
      [
        { text: "Não", style: "cancel" },
        { 
          text: "Sim, remover", 
          style: "destructive", 
          onPress: async () => {
            try {
              console.log("Deletando do banco...");
              // 1. Remove do Banco
              await deleteDoc(doc(db, "bookmarks", bookmarkId));
              console.log("Deletado com sucesso!");

              // 2. Remove da Tela
              setBookmarks(prev => prev.filter(item => item.bookmarkId !== bookmarkId));
            } catch (error) {
              console.error("Erro ao deletar:", error);
              Alert.alert("Erro", "Não foi possível remover.");
            }
          }
        }
      ]
    );
  }

  const handleDetails = (item: any) => {
      router.push({
        pathname: "/stacks/details",
        params: { data: JSON.stringify(item) } 
      });
  }

  const renderBookmarkItem = ({ item }) => {
    const containerStyle = isGrid ? styles.cardGrid : styles.cardList;
    const imageStyle = isGrid ? styles.cardImageGrid : styles.cardImageList;

    return (
      <TouchableOpacity 
        style={containerStyle} 
        onPress={() => handleDetails(item)}
        activeOpacity={0.7}
      >
        <Image 
          source={item.image ? { uri: item.image } : require("../assets/Room.jpg")} 
          style={imageStyle} 
        />
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={isGrid ? 2 : 1}>
            {item.title}
          </Text>
          
          <View style={styles.ratingRow}>
            <StarIcon size={14} color="#ffd700" weight="fill" />
            <Text style={styles.ratingText}>
                {item.rating || 4.8} - {item.location}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={styles.priceText}>
                R$ {item.price ? item.price.toLocaleString('pt-BR') : '0,00'}
              </Text>
              <Text style={styles.priceUnit}> / noite</Text>
            </View>
            
            {/* BOTÃO DE REMOVER CORRIGIDO */}
            {/* Adicionamos zIndex e hitSlop para garantir o clique */}
            <TouchableOpacity 
                style={styles.removeButton}
                onPress={(e) => {
                    e.stopPropagation(); // Impede que o clique abra os detalhes
                    handleRemoveBookmark(item.bookmarkId);
                }}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
               <BookmarkIcon size={24} color="#1ab65c" weight="fill" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon size={28} color="#f4f4f4" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Meus Favoritos</Text>
        
        <View style={{ flexDirection: 'row', gap: 16 }}>
           <TouchableOpacity onPress={() => setIsGrid(false)}>
             <ListIcon 
               size={24} 
               color={!isGrid ? "#1ab65c" : "#f4f4f4"} 
               weight={!isGrid ? "bold" : "regular"} 
             />
           </TouchableOpacity>

           <TouchableOpacity onPress={() => setIsGrid(true)}>
             <SquaresFourIcon 
               size={24} 
               color={isGrid ? "#1ab65c" : "#f4f4f4"} 
               weight={isGrid ? "fill" : "regular"}
             />
           </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1ab65c" style={{ marginTop: 50 }} />
      ) : (
        <FlatList 
          key={isGrid ? 'grid' : 'list'} 
          data={bookmarks}
          keyExtractor={item => item.bookmarkId} 
          renderItem={renderBookmarkItem}
          
          numColumns={isGrid ? 2 : 1}
          columnWrapperStyle={isGrid ? { justifyContent: 'space-between' } : undefined}
          contentContainerStyle={{ paddingBottom: 20, gap: 16 }}
          showsVerticalScrollIndicator={false}
          
          ListEmptyComponent={() => (
              <View style={{ alignItems: 'center', marginTop: 80 }}>
                  <SmileySad size={64} color="#333" />
                  <Text style={{ color: '#757575', textAlign: 'center', marginTop: 10, fontSize: 16 }}>
                      Nenhum imóvel salvo ainda.
                  </Text>
              </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181a20",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f4f4f4",
  },
  cardGrid: {
    backgroundColor: "#1f222a",
    width: "48%", 
    borderRadius: 16,
    padding: 12,
    marginBottom: 0,
  },
  cardImageGrid: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardList: {
    backgroundColor: "#1f222a",
    width: "100%", 
    borderRadius: 16,
    padding: 12,
    flexDirection: "row", 
    gap: 14,
    alignItems: "center",
  },
  cardImageList: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 4,
  },
  ratingText: {
    color: "#757575",
    fontSize: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    marginTop: 4,
  },
  priceText: {
    color: "#1ab65c",
    fontSize: 16, 
    fontWeight: "bold",
  },
  priceUnit: {
    color: "#757575",
    fontSize: 12,
    marginBottom: 3,
  },
  removeButton: {
    zIndex: 10, // Garante que fique acima do card
    padding: 5, // Área extra visual
  }
});