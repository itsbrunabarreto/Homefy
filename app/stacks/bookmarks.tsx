import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Modal
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

// Ícones
import { 
  ArrowLeftIcon, 
  StarIcon, 
  BookmarkIcon, 
  SquaresFourIcon, 
  ListIcon,
  SmileySad
} from "phosphor-react-native";

// Firebase
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

export default function Bookmarks() {
  const router = useRouter();

  // Estados
  const [isGrid, setIsGrid] = useState(true);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para o Modal de Remoção
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // --- BUSCA DADOS ---
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

  // --- ABRIR O MODAL ---
  function onRequestRemove(item: any) {
    setSelectedItem(item);
    setRemoveModalVisible(true);
  }

  // --- CONFIRMAR REMOÇÃO ---
  async function confirmRemove() {
    if (!selectedItem) return;

    try {
      // 1. Deleta do Firestore
      await deleteDoc(doc(db, "bookmarks", selectedItem.bookmarkId));
      
      // 2. Remove da tela
      setBookmarks(prev => prev.filter(item => item.bookmarkId !== selectedItem.bookmarkId));
      
      // 3. Fecha o modal
      setRemoveModalVisible(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Erro ao remover:", error);
    }
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
            
            {/* Botão que abre o Modal */}
            <TouchableOpacity 
                onPress={(e) => {
                    e.stopPropagation();
                    onRequestRemove(item);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
      {/* Header */}
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

      {/* MODAL PERSONALIZADO DE REMOÇÃO */}
      <Modal
        transparent
        visible={removeModalVisible}
        animationType="fade"
        onRequestClose={() => setRemoveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Remover dos Favoritos?</Text>
                
                <View style={styles.modalDivider} />

                {/* Cartãozinho do Imóvel dentro do Modal */}
                {selectedItem && (
                    <View style={styles.modalCard}>
                        <Image 
                            source={selectedItem.image ? { uri: selectedItem.image } : require("../assets/Room.jpg")} 
                            style={styles.modalImage} 
                        />
                        <View style={{flex: 1, justifyContent: 'center', gap: 4}}>
                            <Text style={styles.modalCardTitle} numberOfLines={1}>
                                {selectedItem.title}
                            </Text>
                            <Text style={styles.modalCardLocation} numberOfLines={1}>
                                {selectedItem.location}
                            </Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                <StarIcon size={12} color="#ffd700" weight="fill" />
                                <Text style={styles.modalCardRating}>{selectedItem.rating}</Text>
                            </View>
                        </View>
                        <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
                            <Text style={styles.modalCardPrice}>R${selectedItem.price}</Text>
                            <Text style={styles.modalCardUnit}>/noite</Text>
                            <BookmarkIcon size={20} color="#1ab65c" weight="fill" style={{marginTop: 4}} />
                        </View>
                    </View>
                )}

                <View style={styles.modalButtonsRow}>
                    <TouchableOpacity 
                        style={[styles.modalButton, styles.btnCancel]}
                        onPress={() => setRemoveModalVisible(false)}
                    >
                        <Text style={styles.btnCancelText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.modalButton, styles.btnConfirm]}
                        onPress={confirmRemove}
                    >
                        <Text style={styles.btnConfirmText}>Sim, Remover</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

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
  // Cards
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
  // --- ESTILOS DO MODAL ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end", // Bottom sheet style ou center
    alignItems: "center",
    paddingBottom: 40,
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#1f222a", // Card Color
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f4f4f4",
    marginBottom: 16,
  },
  modalDivider: {
    height: 1,
    width: "100%",
    backgroundColor: "#333",
    marginBottom: 16,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#181a20", // Fundo um pouco mais escuro para destacar
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  modalImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#333",
  },
  modalCardTitle: {
    color: "#f4f4f4",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalCardLocation: {
    color: "#757575",
    fontSize: 12,
  },
  modalCardRating: {
    color: "#757575",
    fontSize: 11,
  },
  modalCardPrice: {
    color: "#1ab65c",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalCardUnit: {
    color: "#757575",
    fontSize: 10,
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  btnCancelText: {
    color: "#fff",
    fontWeight: "600",
  },
  btnConfirm: {
    backgroundColor: "#1ab65c",
    shadowColor: "#1ab65c",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  btnConfirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
});