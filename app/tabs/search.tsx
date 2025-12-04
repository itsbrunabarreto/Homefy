import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  Image,
  Pressable,
  Keyboard,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { 
  MagnifyingGlass, 
  SlidersHorizontal, 
  Star, 
  BookmarkSimple, 
  Clock,
  X,
  MapPin
} from "phosphor-react-native";

// Firebase Imports
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const categories = ["All Hotel", "Recommended", "Popular", "Trending", "Low Price"];

export default function Search() {
  const router = useRouter();
  
  // Estados
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Hotel");
  const [history, setHistory] = useState<string[]>(["Hotel Fazenda", "Resort"]);
  
  // Estado para os dados REAIS do banco
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. BUSCAR DADOS DO FIREBASE
  useEffect(() => {
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

    fetchProperties();
  }, []);

  // 2. FILTRAR DADOS REAIS
  const filteredHotels = properties.filter(item => 
    item.title.toLowerCase().includes(searchText.toLowerCase()) || 
    item.location.toLowerCase().includes(searchText.toLowerCase())
  );

  // Navegação enviando dados (igual na Home)
  function handleDetails(item: any) {
    router.push({
      pathname: "/stacks/details",
      params: { data: JSON.stringify(item) } 
    });
  }

  // Histórico
  function handleSearchSubmit() {
    if (searchText.trim() === "") return;
    setHistory(oldHistory => {
      const newHistory = [searchText, ...oldHistory];
      return [...new Set(newHistory)].slice(0, 5); 
    });
    Keyboard.dismiss(); 
  }

  function removeHistoryItem(itemToRemove: string) {
    setHistory(prev => prev.filter(item => item !== itemToRemove));
  }

  function clearAllHistory() {
    setHistory([]);
  }

  function handleHistoryClick(text: string) {
    setSearchText(text);
  }

  const renderHotelItem = ({ item }: { item: any }) => (
    <Pressable onPress={() => handleDetails(item)} style={styles.card}>
      <View style={styles.cardLeftContent}>
        <Image 
          style={styles.cardImage} 
          // Lógica para imagem real ou placeholder
          source={item.image ? { uri: item.image } : require("../assets/Room.jpg")} 
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
             <MapPin size={12} color="#757575" />
             <Text style={styles.cardSubTitle} numberOfLines={1}>{item.location}</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <Star size={14} color="#ffd700" weight="fill" />
            <Text style={styles.ratingText}>{item.rating || 4.5} ({item.reviews || 0} reviews)</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardRightContent}>
        <Text style={styles.priceText}>R$ {item.price}</Text>
        <Text style={styles.priceUnit}>
            {item.type === 'rent' ? '/ noite' : ''}
        </Text>
        <View style={{ flex: 1 }} /> 
        <BookmarkSimple size={28} color="#1ab65c" weight="regular" />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      
      {/* HEADER DE BUSCA */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MagnifyingGlass size={24} color="#757575" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search hotel..."
            placeholderTextColor="#757575"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit} 
            returnKeyType="search"
          />
          {searchText.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchText("")}>
               <X size={20} color="#757575" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
               <SlidersHorizontal size={24} color="#1ab65c" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CATEGORIAS */}
      <View style={{ height: 50 }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesList}
        >
          {categories.map((cat, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.categoryChip, 
                selectedCategory === cat && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryText, 
                selectedCategory === cat && styles.categoryTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* CONTEÚDO */}
      <View style={styles.contentContainer}>
        
        {loading ? (
            <ActivityIndicator size="large" color="#1ab65c" style={{marginTop: 50}} />
        ) : (
            <>
                {/* MODO 1: SEM TEXTO -> HISTÓRICO */}
                {searchText.length === 0 ? (
                  <View>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Recent</Text>
                      <TouchableOpacity onPress={clearAllHistory}>
                        <Text style={styles.clearText}>Clear All</Text>
                      </TouchableOpacity>
                    </View>

                    {history.map((item, index) => (
                      <View key={index} style={styles.recentItem}>
                        <TouchableOpacity 
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}
                          onPress={() => handleHistoryClick(item)}
                        >
                          <Clock size={20} color="#757575" />
                          <Text style={styles.recentText}>{item}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => removeHistoryItem(item)}>
                          <X size={20} color="#757575" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  /* MODO 2: COM TEXTO -> LISTA FILTRADA REAL */
                  <View style={{ flex: 1 }}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>
                        Results ({filteredHotels.length})
                      </Text>
                    </View>
                    
                    <FlatList 
                      data={filteredHotels} 
                      keyExtractor={(item) => item.id}
                      renderItem={renderHotelItem}
                      contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
                      showsVerticalScrollIndicator={false}
                      ListEmptyComponent={() => (
                        <Text style={{ color: "#757575", textAlign: "center", marginTop: 20 }}>
                          Nenhum imóvel encontrado.
                        </Text>
                      )}
                    />
                  </View>
                )}
            </>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181a20",
    paddingTop: 60, 
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    height: 56,
    backgroundColor: "#1f222a",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: "#f4f4f4",
    fontSize: 16,
  },
  categoriesList: {
    gap: 12,
    paddingRight: 20,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#1ab65c",
    justifyContent: "center",
    height: 40,
  },
  categoryChipActive: {
    backgroundColor: "#1ab65c",
  },
  categoryText: {
    color: "#1ab65c",
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#fff",
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#f4f4f4",
    fontSize: 18,
    fontWeight: "700",
  },
  clearText: {
    color: "#1ab65c",
    fontWeight: "600",
  },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1f222a",
  },
  recentText: {
    color: "#a1a1aa",
    fontSize: 16,
  },
  card: {
    width: "100%",
    backgroundColor: "#1f222a",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLeftContent: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    flex: 1, 
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#333",
  },
  cardInfo: {
    justifyContent: "space-evenly",
    height: 90,
    flex: 1, 
  },
  cardTitle: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "700",
  },
  cardSubTitle: {
    color: "#757575",
    fontSize: 13,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingText: {
    color: "#1ab65c",
    fontSize: 12,
    fontWeight: "600",
  },
  cardRightContent: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  priceText: {
    color: "#1ab65c",
    fontSize: 18,
    fontWeight: "bold",
  },
  priceUnit: {
    color: "#757575",
    fontSize: 12,
    marginTop: -4,
  },
});