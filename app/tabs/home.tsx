import React, { useState, useCallback, useRef } from "react";
import { 
  StyleSheet, Text, View, TextInput, Pressable, Image, FlatList, 
  ActivityIndicator, TouchableOpacity, Alert, ScrollView, Modal, 
  PanResponder, Animated, Dimensions
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { 
  BellRinging, Bookmark, MagnifyingGlass, SlidersHorizontal, 
  Star, X, Check, House, Buildings, MapPin
} from "phosphor-react-native";
import { useRouter, useFocusEffect } from "expo-router";

// Firebase
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs, query, orderBy, addDoc, where, deleteDoc, doc } from "firebase/firestore";

const CATEGORIES = ["All", "Recommended", "Popular", "Trending", "Low Price"];
const COUNTRIES = ["All", "France", "USA", "UK", "Turkiye", "Brazil"];

// --- COMPONENTE DE SLIDER PERSONALIZADO (Para o Preço) ---
const CustomPriceSlider = ({ min, max, value, onValueChange }: any) => {
  const [width, setWidth] = useState(0);
  const pan = useRef(new Animated.Value(0)).current;

  const updateValue = (gestureState: any) => {
    let move = gestureState.moveX - 40; 
    if (move < 0) move = 0;
    if (move > width) move = width;
    
    const percentage = move / width;
    const newValue = Math.round(min + percentage * (max - min));
    onValueChange(newValue);
    return move;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
         updateValue(gestureState);
      },
      onPanResponderRelease: (_, gestureState) => {
         updateValue(gestureState);
      },
    })
  ).current;

  const left = width ? ((value - min) / (max - min)) * width : 0;

  return (
    <View 
      style={styles.sliderContainer} 
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.sliderTrack} />
      <View style={[styles.sliderFill, { width: left }]} />
      <View 
        style={[styles.sliderThumb, { left: left - 12 }]} 
        {...panResponder.panHandlers} 
      >
         <View style={styles.sliderThumbDot} />
      </View>
    </View>
  );
};

export default function Home() {
  const router = useRouter();
  
  // --- DADOS ---
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  
  // --- UI STATES ---
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userName, setUserName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // --- ESTADOS DO FILTRO (MODAL) ---
  const [filterCountry, setFilterCountry] = useState("All");
  const [priceMax, setPriceMax] = useState(5000);
  const [filterRating, setFilterRating] = useState(0);
  const [filterType, setFilterType] = useState("all");

  // 1. BUSCAR DADOS
  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (user) setUserName(user.displayName || "Viajante");

      const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      setProperties(list);
      setFilteredList(list);
      
      // Define os 5 primeiros como Destaques
      setFeaturedProperties(list.slice(0, 5)); 

      if (user) {
        const qFav = query(collection(db, "bookmarks"), where("userId", "==", user.uid));
        const snapshotFav = await getDocs(qFav);
        const ids = snapshotFav.docs.map(doc => doc.data().id);
        setBookmarkedIds(ids);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // 2. LÓGICA DE CATEGORIAS (TOPO)
  const applyCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    let list = [...properties];

    switch (category) {
      case "Recommended":
        list = list.filter(item => item.rating >= 4.7);
        break;
      case "Popular":
        list = list.filter(item => item.reviews > 500);
        break;
      case "Trending":
        list = list.slice(0, 5);
        break;
      case "Low Price":
        list.sort((a, b) => a.price - b.price);
        break;
      case "All":
      default:
        list = properties;
        break;
    }
    setFilteredList(list);
  };

  // 3. APLICAR FILTROS DO MODAL
  const applyModalFilters = () => {
    setModalVisible(false);
    setLoading(true);

    const result = properties.filter(item => {
      const matchType = filterType === 'all' ? true : item.type === filterType;
      const matchCountry = filterCountry === "All" ? true : item.location.includes(filterCountry);
      const matchPrice = item.price <= priceMax;
      const matchRating = filterRating === 0 ? true : (item.rating >= filterRating);

      return matchType && matchCountry && matchPrice && matchRating;
    });

    setSelectedCategory("All"); 
    setFilteredList(result);
    setLoading(false);
  };

  const resetFilters = () => {
     setFilterCountry("All");
     setPriceMax(5000);
     setFilterRating(0);
     setFilterType("all");
     setFilteredList(properties);
     setSelectedCategory("All");
     setModalVisible(false);
  };

  // 4. AÇÕES GERAIS
  function handleDetails(item: any) {
      router.push({
        pathname: "/stacks/details",
        params: { data: JSON.stringify(item) } 
      });
  }

  async function handleToggleBookmark(item: any) {
    const user = auth.currentUser;
    if (!user) return Alert.alert("Atenção", "Faça login.");

    const isAlreadySaved = bookmarkedIds.includes(item.id);

    if (isAlreadySaved) {
       setBookmarkedIds(prev => prev.filter(id => id !== item.id));
    } else {
       setBookmarkedIds(prev => [...prev, item.id]);
    }

    try {
      if (isAlreadySaved) {
        const q = query(collection(db, "bookmarks"), where("userId", "==", user.uid), where("id", "==", item.id));
        const snapshot = await getDocs(q);
        snapshot.forEach(async (d) => await deleteDoc(doc(db, "bookmarks", d.id)));
      } else {
        await addDoc(collection(db, "bookmarks"), { userId: user.uid, ...item, savedAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Filtro final de busca por texto
  const displayList = filteredList.filter(item => 
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.location.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderRecentCard = ({ item }: { item: any }) => {
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
                  <Star size={14} color="#ffd700" weight="fill" />
                  <Text style={{ color: '#757575', fontSize: 12 }}>{item.rating || 4.8}</Text>
               </View>
               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ color: '#757575', fontSize: 12 }}>({item.reviews || 0} reviews)</Text>
               </View>
            </View>
          </View>
        </Pressable>
        <View style={styles.cardInfoBuy}>
          <Text style={styles.cardInfoBuyText}>R$ {item.price}</Text>
          <Text style={{color: '#757575', fontSize: 10}}>
             {item.type === 'rent' ? '/ noite' : ''}
          </Text>
          <TouchableOpacity onPress={() => handleToggleBookmark(item)} style={{marginTop: 5}}>
              <Bookmark size={24} color={isSaved ? "#1ab65c" : "#1ab65c"} weight={isSaved ? "fill" : "duotone"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderFeaturedCard = ({ item }: { item: any }) => {
    const isSaved = bookmarkedIds.includes(item.id);
    return (
      <Pressable onPress={() => handleDetails(item)} style={styles.featuredCard}>
        <Image 
          style={styles.featuredImage} 
          source={item.image ? { uri: item.image } : require("../assets/Room.jpg")}
        />
        <View style={styles.ratingTag}>
           <Star size={12} color="#fff" weight="fill" />
           <Text style={styles.ratingText}>{item.rating || 4.8}</Text>
        </View>
        <View style={styles.featuredInfo}>
           <View style={{flex: 1}}>
             <Text style={styles.featuredTitle} numberOfLines={1}>{item.title}</Text>
             <Text style={styles.featuredLocation} numberOfLines={1}>{item.location}</Text>
           </View>
           <View style={styles.featuredFooter}>
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                 <Text style={styles.featuredPrice}>R$ {item.price}</Text>
                 <Text style={styles.featuredUnit}> / noite</Text>
              </View>
              <TouchableOpacity onPress={() => handleToggleBookmark(item)}>
                 <Bookmark size={24} color={isSaved ? "#1ab65c" : "#fff"} weight={isSaved ? "fill" : "regular"} />
              </TouchableOpacity>
           </View>
        </View>
      </Pressable>
    );
  };

  // HEADER COMPONENT
  const ListHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require("../assets/logo.png")} style={styles.logoImage} />
          <Text style={styles.headerLeftText}>Homefy</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push("/stacks/notifications")}>
             <BellRinging size={28} color="#f4f4f4" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/stacks/bookmarks")}>
             <Bookmark size={28} color="#f4f4f4" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.greeting}>Olá, {userName} 👋</Text>

      <View style={styles.inputContainer}>
        <MagnifyingGlass size={24} color="#757575" />
        <TextInput 
          style={styles.input}
          placeholder="Buscar..." 
          placeholderTextColor= "#757575" 
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
            <SlidersHorizontal size={24} color="#1ab65c" />
        </TouchableOpacity>
      </View>

      {searchText.length === 0 && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
             {CATEGORIES.map((cat, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                  onPress={() => applyCategoryFilter(cat)}
                >
                   <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                </TouchableOpacity>
             ))}
          </ScrollView>

          <FlatList 
            data={featuredProperties}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={renderFeaturedCard}
            contentContainerStyle={{ gap: 20, paddingRight: 20 }}
            style={{ marginBottom: 30 }}
          />
        </>
      )}

      <View style={styles.sectionHeader}>
         <Text style={styles.sectionTitle}>
            {searchText.length > 0 
              ? `Resultados (${displayList.length})` 
              : `Vistos Recentemente` 
            }
         </Text>
         {searchText.length === 0 && <Text style={styles.sectionLink}>Ver Todos</Text>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {loading ? (
        <ActivityIndicator size="large" color="#1ab65c" style={{marginTop: 100}} />
      ) : (
        <FlatList 
            data={displayList} 
            keyExtractor={(item) => item.id}
            renderItem={renderRecentCard}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={() => (
               <Text style={{color: '#757575', textAlign: 'center', marginTop: 20}}>Nenhum imóvel encontrado.</Text>
            )}
        />
      )}

      {/* --- MODAL DE FILTROS --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                 <Text style={styles.modalTitle}>Filtrar Imóveis</Text>
                 <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <X size={24} color="#f4f4f4" />
                 </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                 <Text style={styles.filterLabel}>País / Local</Text>
                 <View style={styles.chipsRow}>
                    {COUNTRIES.map((c) => (
                       <TouchableOpacity 
                          key={c} 
                          style={[styles.filterChip, filterCountry === c && styles.filterChipActive]}
                          onPress={() => setFilterCountry(c)}
                       >
                          <Text style={[styles.filterChipText, filterCountry === c && styles.textActive]}>{c}</Text>
                       </TouchableOpacity>
                    ))}
                 </View>

                 {/* PREÇO COM SLIDER PERSONALIZADO */}
                 <Text style={styles.filterLabel}>Preço Máximo: R$ {priceMax}</Text>
                 <CustomPriceSlider 
                    min={0} 
                    max={5000} 
                    value={priceMax} 
                    onValueChange={(val: number) => setPriceMax(val)} 
                 />
                 <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
                    <Text style={{color: '#757575'}}>R$ 0</Text>
                    <Text style={{color: '#757575'}}>R$ 5.000+</Text>
                 </View>

                 <Text style={styles.filterLabel}>Avaliação (Mínima)</Text>
                 <View style={styles.chipsRow}>
                    {[5, 4, 3, 2].map((r) => (
                       <TouchableOpacity 
                          key={r} 
                          style={[styles.filterChip, filterRating === r && styles.filterChipActive]}
                          onPress={() => setFilterRating(r)}
                       >
                          <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                             <Star size={14} weight="fill" color={filterRating === r ? "#fff" : "#1ab65c"} />
                             <Text style={[styles.filterChipText, filterRating === r && styles.textActive]}>{r}+</Text>
                          </View>
                       </TouchableOpacity>
                    ))}
                 </View>
                 
                 <Text style={styles.filterLabel}>Tipo de Acomodação</Text>
                 <View style={styles.chipsRow}>
                     <TouchableOpacity style={[styles.filterChip, filterType === 'all' && styles.filterChipActive]} onPress={() => setFilterType('all')}>
                        <Text style={[styles.filterChipText, filterType === 'all' && styles.textActive]}>Todos</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={[styles.filterChip, filterType === 'rent' && styles.filterChipActive]} onPress={() => setFilterType('rent')}>
                        <Text style={[styles.filterChipText, filterType === 'rent' && styles.textActive]}>Aluguel</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={[styles.filterChip, filterType === 'sale' && styles.filterChipActive]} onPress={() => setFilterType('sale')}>
                        <Text style={[styles.filterChipText, filterType === 'sale' && styles.textActive]}>Venda</Text>
                     </TouchableOpacity>
                 </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                 <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                    <Text style={styles.resetText}>Limpar</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.applyButton} onPress={applyModalFilters}>
                    <Text style={styles.applyText}>Aplicar Filtro</Text>
                 </TouchableOpacity>
              </View>
           </View>
        </View>
      </Modal>
    </View>
  );
}
 
export const styles = StyleSheet.create({ 
  // ... Mesmos estilos da versão anterior ...
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
    alignItems: "center"
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
  logoImage: {
    width: 32,  
    height: 32,
    resizeMode: "contain", 
  },
  greeting: {
    marginTop: 24,
    marginBottom: 20,
    color: "#f4f4f4",
    fontSize: 32,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    height: 56,
    backgroundColor: "#1f222a",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: "#f4f4f4",
    fontSize: 16
  },
  categoriesContainer: {
    marginBottom: 24,
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#1ab65c",
    marginRight: 10,
    height: 40,
    justifyContent: 'center'
  },
  categoryChipActive: {
    backgroundColor: "#1ab65c",
  },
  categoryText: {
    color: "#1ab65c",
    fontWeight: "700",
  },
  categoryTextActive: {
    color: "#fff",
  },
  featuredCard: {
    width: 280,
    height: 360,
    backgroundColor: "#1f222a",
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  ratingTag: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#1ab65c',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },
  featuredInfo: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(24, 26, 32, 0.9)', 
    borderRadius: 16,
    padding: 15,
    gap: 5
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  featuredLocation: {
    color: '#ccc',
    fontSize: 12
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5
  },
  featuredPrice: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  featuredUnit: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 2
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#f4f4f4',
    fontSize: 20,
    fontWeight: 'bold'
  },
  sectionLink: {
    color: '#1ab65c',
    fontWeight: '600'
  },
  card: {
    width: "100%",
    height: 120,
    borderRadius: 16,
    backgroundColor: "#1f222a",
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
    gap: 6,
  },
  cardInfoTitle: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardInfoSubTitle: {
    color: "#757575",
    fontSize: 13,
  },
  cardInfoBuy: {
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  cardInfoBuyText: {
    color: "#1ab65c",
    fontSize: 18, 
    fontWeight: "bold",
  },
  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1f222a',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f4f4f4',
  },
  filterLabel: {
    color: '#f4f4f4',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  priceRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     marginBottom: 10
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1ab65c',
    marginBottom: 8,
  },
  filterChipActive: {
    backgroundColor: '#1ab65c',
  },
  filterChipText: {
    color: '#1ab65c',
    fontWeight: '600',
  },
  textActive: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
    gap: 15,
  },
  resetButton: {
    flex: 1,
    backgroundColor: 'rgba(26, 182, 92, 0.1)',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  resetText: {
    color: '#1ab65c',
    fontWeight: 'bold',
    fontSize: 16,
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#1ab65c',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // --- SLIDER STYLES ---
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    position: 'absolute',
    width: '100%',
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#1ab65c',
    borderRadius: 2,
    position: 'absolute',
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1ab65c',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff'
  },
  sliderThumbDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff'
  }
});