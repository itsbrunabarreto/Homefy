import React, { useState } from "react";
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
  Keyboard
} from "react-native";
import { useRouter } from "expo-router";
import { 
  MagnifyingGlass, 
  SlidersHorizontal, 
  Star, 
  BookmarkSimple, 
  Clock,
  X
} from "phosphor-react-native";

// DADOS DOS HOTÉIS (Fixo por enquanto, mas poderia vir do Firebase)
const hotelsData = [
  { id: '1', name: 'Hotel Nova Vista', location: 'Santo André, SP', price: '450,00', rating: 4.8, image: require("../assets/Room.jpg") },
  { id: '2', name: 'Grand Palace', location: 'São Paulo, SP', price: '850,00', rating: 4.9, image: require("../assets/Room.jpg") },
  { id: '3', name: 'Pousada Recanto', location: 'Campos do Jordão, SP', price: '320,00', rating: 4.5, image: require("../assets/Room.jpg") },
  { id: '4', name: 'Resort Blue', location: 'Rio de Janeiro, RJ', price: '1200,00', rating: 4.7, image: require("../assets/Room.jpg") },
];

const categories = ["All Hotel", "Recommended", "Popular", "Trending", "Low Price"];

export default function Search() {
  const router = useRouter();
  
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Hotel");
  
  // Estado para guardar o histórico (enquanto o app estiver aberto)
  const [history, setHistory] = useState<string[]>(["Hotel Fazenda", "Resort"]);

  // 1. LÓGICA DE FILTRO: Filtra os hotéis com base no que foi digitado
  const filteredHotels = hotelsData.filter(hotel => 
    hotel.name.toLowerCase().includes(searchText.toLowerCase()) || 
    hotel.location.toLowerCase().includes(searchText.toLowerCase())
  );

  // 2. ADICIONAR AO HISTÓRICO: Quando aperta "Enter" no teclado
  function handleSearchSubmit() {
    if (searchText.trim() === "") return;
    
    // Adiciona ao topo da lista e remove duplicados
    setHistory(oldHistory => {
      const newHistory = [searchText, ...oldHistory];
      return [...new Set(newHistory)].slice(0, 5); // Mantém apenas os 5 últimos
    });
    
    Keyboard.dismiss(); // Fecha o teclado
  }

  // Remove um item específico do histórico
  function removeHistoryItem(itemToRemove: string) {
    setHistory(prev => prev.filter(item => item !== itemToRemove));
  }

  // Limpa tudo
  function clearAllHistory() {
    setHistory([]);
  }

  // Clica no histórico e preenche a busca
  function handleHistoryClick(text: string) {
    setSearchText(text);
  }

  const renderHotelItem = ({ item }: { item: any }) => (
    <Pressable onPress={() => router.push("/stacks/details")} style={styles.card}>
      <View style={styles.cardLeftContent}>
        <Image style={styles.cardImage} source={item.image} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubTitle}>{item.location}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={14} color="#ffd700" weight="fill" />
            <Text style={styles.ratingText}>{item.rating} (reviews)</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardRightContent}>
        <Text style={styles.priceText}>R$ {item.price}</Text>
        <Text style={styles.priceUnit}>/ noite</Text>
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
            onSubmitEditing={handleSearchSubmit} // Dispara ao apertar Enter/Ok no teclado
            returnKeyType="search"
          />
          {/* Se tiver texto, mostra um X para limpar, senão mostra o ícone de filtro */}
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
        
        {/* MODO 1: SEM TEXTO DIGITADO -> MOSTRA HISTÓRICO */}
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
          /* MODO 2: COM TEXTO -> MOSTRA LISTA FILTRADA */
          <View style={{ flex: 1 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Results ({filteredHotels.length})
              </Text>
            </View>
            
            <FlatList 
              data={filteredHotels} // Agora usamos a lista filtrada!
              keyExtractor={(item) => item.id}
              renderItem={renderHotelItem}
              contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <Text style={{ color: "#757575", textAlign: "center", marginTop: 20 }}>
                  Nenhum hotel encontrado com esse nome.
                </Text>
              )}
            />
          </View>
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

  // --- HEADER & SEARCH ---
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

  // --- CATEGORIAS ---
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

  // --- CONTEÚDO ---
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

  // --- BUSCAS RECENTES ---
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

  // --- CARD DO HOTEL ---
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
  },
  cardTitle: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "700",
    maxWidth: 130,
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