import React, { useState } from "react";
import { 
  ArrowLeft, 
  BookmarkSimple, 
  DotsThreeCircle, 
  MapPin, 
  Bed, 
  Bathtub, 
  ArrowsOutSimple, 
  SwimmingPool, 
  WifiHigh, 
  ForkKnife, 
  Car, 
  Star 
} from "phosphor-react-native";
import {
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import { useRouter } from "expo-router";

export default function Details() {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Função para simular reserva
  const handleBooking = () => {
    Alert.alert("Reserva", "Deseja reservar este hotel?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Confirmar", onPress: () => router.push("/stacks/payment") } // Supondo que haverá uma tela de pagamento
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* HEADER COM IMAGEM DE FUNDO */}
        <View style={styles.header}>
          <Image style={styles.headerImage} source={require("../assets/Room.jpg")} />
          
          <View style={styles.headerInfoButtons}>
            <TouchableOpacity onPress={() => router.back()}>
               <ArrowLeft size={32} color= "#f4f4f4" />
            </TouchableOpacity>

            <View style={styles.headerInfoButtonsRight}>
              <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)}>
                 <BookmarkSimple 
                   size={32} 
                   color= "#f4f4f4" 
                   weight={isBookmarked ? "fill" : "regular"} 
                 />
              </TouchableOpacity>
              <TouchableOpacity>
                 <DotsThreeCircle size={32} color= "#f4f4f4" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* TÍTULO E ENDEREÇO */}
        <Text style={styles.infoNameText}>Royale President Hotel</Text>

        <View style={styles.contentAddress}>
          <MapPin size={24} color="#1ab65c" weight="fill" />
          <Text style={styles.contentAddressText}>79 Place de la Madeleine, Paris, 75009, France</Text>
        </View>

        <View style={styles.separator} />

        {/* GALERIA DE FOTOS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gallery Photos</Text>
          <Text style={styles.sectionLink}>See All</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contentPhotoContainer}>
          <Image style={styles.contentPhotoImage} source={require("../assets/Room.jpg")} />
          <Image style={styles.contentPhotoImage} source={require("../assets/Room.jpg")} />
          <Image style={styles.contentPhotoImage} source={require("../assets/Room.jpg")} />
        </ScrollView>

        {/* DETAILS (Quartos, Banheiros, etc) */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Details</Text>
        </View>
        <View style={styles.detailsRow}>
           <View style={styles.detailItem}>
              <Bed size={24} color="#1ab65c" />
              <Text style={styles.detailText}>4 Beds</Text>
           </View>
           <View style={styles.detailItem}>
              <Bathtub size={24} color="#1ab65c" />
              <Text style={styles.detailText}>2 Baths</Text>
           </View>
           <View style={styles.detailItem}>
              <ArrowsOutSimple size={24} color="#1ab65c" />
              <Text style={styles.detailText}>4000 sqft</Text>
           </View>
        </View>

        {/* DESCRIPTION */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Description</Text>
        </View>
        <Text style={styles.descriptionText} numberOfLines={3}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
        </Text>

        {/* FACILITIES (Grid de ícones) */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Facilities</Text>
        </View>
        <View style={styles.facilitiesGrid}>
           <View style={styles.facilityItem}>
              <SwimmingPool size={24} color="#1ab65c" />
              <Text style={styles.facilityText}>Pool</Text>
           </View>
           <View style={styles.facilityItem}>
              <WifiHigh size={24} color="#1ab65c" />
              <Text style={styles.facilityText}>WiFi</Text>
           </View>
           <View style={styles.facilityItem}>
              <ForkKnife size={24} color="#1ab65c" />
              <Text style={styles.facilityText}>Restaurant</Text>
           </View>
           <View style={styles.facilityItem}>
              <Car size={24} color="#1ab65c" />
              <Text style={styles.facilityText}>Parking</Text>
           </View>
        </View>

        {/* LOCATION (Mapa fake) */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Location</Text>
        </View>
        <View style={styles.mapContainer}>
           {/* Aqui você colocaria um componente de mapa real (react-native-maps) */}
           {/* Por enquanto, simulamos com uma View cinza e um pino */}
           <MapPin size={40} color="#1ab65c" weight="fill" />
           <Text style={{color: '#555', marginTop: 5}}>Map View</Text>
        </View>

        {/* REVIEW */}
        <View style={styles.sectionHeader}>
           <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
             <Text style={styles.sectionTitle}>Review</Text>
             <Star size={18} color="#ffd700" weight="fill" />
             <Text style={{color: '#1ab65c', fontWeight: 'bold'}}>4.8</Text>
             <Text style={{color: '#757575'}}>(4.981 reviews)</Text>
           </View>
           <Text style={styles.sectionLink}>See All</Text>
        </View>
        
        {/* Review Card Simples */}
        <View style={styles.reviewCard}>
           <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
              <View style={styles.avatarPlaceholder} /> 
              <View>
                 <Text style={{color: '#fff', fontWeight: 'bold'}}>Jenny Wilson</Text>
                 <Text style={{color: '#757575', fontSize: 12}}>Dec 10, 2024</Text>
              </View>
              <View style={{flex: 1}} />
              <View style={styles.ratingBadge}>
                 <Star size={12} color="#fff" weight="fill" />
                 <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}}>5</Text>
              </View>
           </View>
           <Text style={styles.reviewText}>
             Very nice and comfortable hotel, thank you for accompanying my vacation!
           </Text>
        </View>

      </ScrollView>

      {/* FOOTER FIXO (Preço e Botão) */}
      <View style={styles.footer}>
        <View style={styles.footerContainerText}>
          <Text style={styles.footerContainerTextMoney}>$29</Text>
          <Text style={styles.footerContainerTextMonth}>/ night</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Book Now!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181a20", 
  },
  header: {
    width: "100%",
    height: 300, // Altura fixa para a imagem
  },
  headerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  headerInfoButtons: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerInfoButtonsRight: {
    flexDirection: "row",
    gap: 15,
  },
  infoNameText:{
    color: "#f4f4f4",
    fontSize: 28,
    fontWeight:"bold",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  contentAddress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  contentAddressText: {
    color: "#f4f4f4",
    fontSize: 13,
    flex: 1, // Para quebrar linha se for longo
  },
  separator:{
    height: 1,
    backgroundColor: "#333",
    marginHorizontal: 20,
    marginTop: 20,
  },
  
  // Section Headers (Reutilizável)
  sectionHeader: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    color: "#f4f4f4",
    fontWeight: "bold",
  },
  sectionLink: {
    fontSize: 14,
    color: "#1ab65c",
    fontWeight: "600",
  },

  // Photos
  contentPhotoContainer: {
    paddingLeft: 20,
    marginTop: 15,
  },
  contentPhotoImage: {
    width: 120,
    height: 80,
    borderRadius: 12,
    marginRight: 10,
  },

  // Details Row
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Espalha os itens
    paddingHorizontal: 20,
    marginTop: 15,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    color: "#757575",
    fontWeight: "600",
  },

  // Description
  descriptionText: {
    color: "#757575",
    paddingHorizontal: 20,
    marginTop: 10,
    lineHeight: 20,
  },

  // Facilities Grid
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: 15,
    gap: 20,
  },
  facilityItem: {
    alignItems: "center",
    width: "20%", // Aproximadamente 4 itens por linha
    gap: 5,
  },
  facilityText: {
    color: "#757575",
    fontSize: 12,
  },

  // Map
  mapContainer: {
    height: 150,
    backgroundColor: "#2a2d35",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  // Review Card
  reviewCard: {
    backgroundColor: "#1f222a",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 15,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#555",
  },
  ratingBadge: {
    flexDirection: "row",
    backgroundColor: "#1ab65c",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },
  reviewText: {
    color: "#f4f4f4",
    marginTop: 10,
    lineHeight: 20,
    fontSize: 13,
  },

  // Footer Fixo
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 90,
    backgroundColor: "#181a20", // Fundo igual da tela
    borderTopWidth: 1,
    borderTopColor: "#333",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  footerContainerText: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  footerContainerTextMoney: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1ab65c",
  },
  footerContainerTextMonth: {
    fontSize: 14,
    color: "#f4f4f4",
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#1ab65c",
    width: 160,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1ab65c",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  buttonText: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "bold",
  },
});