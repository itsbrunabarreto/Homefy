import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

import { MagnifyingGlass, Receipt, MapPin } from "phosphor-react-native";

// Firebase
import { auth, db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Booking() {
  const router = useRouter();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Ongoing" | "Completed" | "Canceled">("Ongoing");

  const fetchBookings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "bookings"), 
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      // Ordenação manual por data
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setBookings(list);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const filteredData = bookings.filter(item => (item.status || "Ongoing") === activeTab);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image 
            // Fallback de imagem
            source={item.image ? { uri: item.image } : require("../assets/Room.jpg")} 
            style={styles.cardImage} 
          />
          
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color="#757575" />
              <Text style={styles.cardLocation}>{item.location}</Text>
            </View>
            
            <View style={[
              styles.statusBadge, 
              item.status === "Ongoing" ? styles.bgGreen : 
              item.status === "Canceled" ? styles.bgRed : styles.bgGray
            ]}>
              <Text style={[
                styles.statusText,
                item.status === "Ongoing" ? { color: "#1ab65c" } : 
                item.status === "Canceled" ? { color: "#ff4d4d" } : { color: "#fff" }
              ]}>
                {item.status === "Ongoing" ? "Confirmed" : item.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.actionRow}>
          {item.status === "Ongoing" && (
            <>
              <TouchableOpacity 
                style={styles.btnOutline}
                onPress={() => router.push({
                    pathname: "/stacks/cancelBooking",
                    params: { data: JSON.stringify(item) }
                })}
              >
                <Text style={styles.btnOutlineText}>Cancel Booking</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.btnFilled}
                onPress={() => router.push({
                    pathname: "/stacks/ticket",
                    params: { data: JSON.stringify(item) }
                })}
              >
                <Text style={styles.btnFilledText}>View Ticket</Text>
              </TouchableOpacity>
            </>
          )}

          {item.status === "Completed" && (
            <TouchableOpacity 
                style={[styles.btnFilled, { flex: 1 }]}
                onPress={() => router.push({
                    pathname: "/stacks/details",
                    params: { data: JSON.stringify({
                        id: item.propertyId, 
                        title: item.title,
                        location: item.location,
                        price: item.price,
                        image: item.image
                    }) }
                })}
            >
               <Text style={styles.btnFilledText}>Book Again</Text>
            </TouchableOpacity>
          )}

          {item.status === "Canceled" && (
             <Text style={styles.refundText}>
               Canceled on {item.canceledAt ? new Date(item.canceledAt).toLocaleDateString() : "Unknown date"}
             </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
           <Image source={require("../assets/logo.png")} style={styles.logoImage} />
           <Text style={styles.headerTitle}>My Booking</Text>
        </View>
        <TouchableOpacity>
           <MagnifyingGlass size={28} color="#f4f4f4" />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        {["Ongoing", "Completed", "Canceled"].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[
              styles.tabButton, 
              activeTab === tab && styles.tabButtonActive
            ]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.tabTextActive
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CONTEÚDO */}
      {loading ? (
        <ActivityIndicator size="large" color="#1ab65c" style={{ marginTop: 50 }} />
      ) : (
        <FlatList 
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100, gap: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
             <View style={{ alignItems: 'center', marginTop: 50 }}>
               <Receipt size={64} color="#333" />
               <Text style={{ color: '#757575', marginTop: 10 }}>
                 No {activeTab.toLowerCase()} bookings found.
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
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoImage: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f4f4f4",
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 24,
    backgroundColor: "#1f222a",
    borderRadius: 12,
    padding: 4, 
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabButtonActive: {
    backgroundColor: "#1ab65c",
  },
  tabText: {
    color: "#757575",
    fontWeight: "600",
    fontSize: 14,
  },
  tabTextActive: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1f222a",
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#333",
  },
  cardInfo: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  cardTitle: {
    color: "#f4f4f4",
    fontSize: 18,
    fontWeight: "bold",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardLocation: {
    color: "#757575",
    fontSize: 13,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bgGreen: { backgroundColor: "rgba(26, 182, 92, 0.1)" }, 
  bgRed: { backgroundColor: "rgba(255, 77, 77, 0.1)" }, 
  bgGray: { backgroundColor: "rgba(117, 117, 117, 0.1)" },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#2a2d35",
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  btnOutline: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#35383F",
    alignItems: "center",
  },
  btnOutlineText: {
    color: "#f4f4f4",
    fontWeight: "600",
  },
  btnFilled: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#1ab65c",
    alignItems: "center",
    shadowColor: "#1ab65c",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  btnFilledText: {
    color: "#fff",
    fontWeight: "600",
  },
  refundText: {
    color: "#757575",
    fontStyle: "italic",
    fontSize: 12,
  },
});