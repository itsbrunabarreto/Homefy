import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  Dimensions
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

export default function Details() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const property = params.data ? JSON.parse(params.data as string) : null;

  const galleryImages = property?.images || (property?.image ? [property.image] : []);

  useEffect(() => {
    if (galleryImages.length > 0) {
      setActiveImage(galleryImages[0]);
    }
  }, []);

  if (!property) {
    return (
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
            <ActivityIndicator color="#1ab65c" size="large"/>
        </View>
    );
  }

  const handleBooking = () => {
    router.push({
        pathname: "/stacks/selectDate",
        params: { property: JSON.stringify(property) }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Image 
            style={styles.headerImage} 
            source={activeImage ? { uri: activeImage } : require("../assets/Room.jpg")} 
          />
          
          <View style={styles.overlay} />

          <View style={styles.headerInfoButtons}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
               <ArrowLeft size={28} color= "#f4f4f4" />
            </TouchableOpacity>

            <View style={styles.headerInfoButtonsRight}>
              <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)} style={styles.iconBtn}>
                 <BookmarkSimple 
                   size={28} 
                   color= "#f4f4f4" 
                   weight={isBookmarked ? "fill" : "regular"} 
                 />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                 <DotsThreeCircle size={28} color= "#f4f4f4" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* TÍTULO E ENDEREÇO */}
        <Text style={styles.infoNameText}>{property.title}</Text>

        <View style={styles.contentAddress}>
          <MapPin size={24} color="#1ab65c" weight="fill" />
          <Text style={styles.contentAddressText}>{property.location}</Text>
        </View>

        <View style={styles.separator} />

        {/* GALERIA */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Galeria de Fotos</Text>
          <Text style={styles.sectionLink}>Ver Tudo</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.contentPhotoContainer}
        >
          {galleryImages.length > 0 ? (
            galleryImages.map((imgUrl: string, index: number) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => setActiveImage(imgUrl)}
                activeOpacity={0.7}
              >
                <Image 
                  style={[
                    styles.contentPhotoImage, 
                    activeImage === imgUrl && { borderWidth: 2, borderColor: '#1ab65c' }
                  ]} 
                  source={{ uri: imgUrl }} 
                />
              </TouchableOpacity>
            ))
          ) : (
            [1, 2, 3].map((_, i) => (
               <Image key={i} style={styles.contentPhotoImage} source={require("../assets/Room.jpg")} />
            ))
          )}
        </ScrollView>

        {/* DETALHES */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Detalhes</Text>
        </View>
        <View style={styles.detailsRow}>
           <View style={styles.detailItem}>
              <Bed size={24} color="#1ab65c" />
              <Text style={styles.detailText}>{property.bedrooms || 0} Quartos</Text>
           </View>
           <View style={styles.detailItem}>
              <Bathtub size={24} color="#1ab65c" />
              <Text style={styles.detailText}>{property.bathrooms || 0} Banheiros</Text>
           </View>
           <View style={styles.detailItem}>
              <ArrowsOutSimple size={24} color="#1ab65c" />
              <Text style={styles.detailText}>{property.area || 0} m²</Text>
           </View>
        </View>

        {/* DESCRIÇÃO */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Descrição</Text>
        </View>
        <Text style={styles.descriptionText} numberOfLines={4}>
          {property.description || "Nenhuma descrição disponível."}
        </Text>

        {/* INSTALAÇÕES */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Instalações</Text>
        </View>
        <View style={styles.facilitiesGrid}>
           <View style={styles.facilityItem}><SwimmingPool size={24} color="#1ab65c" /><Text style={styles.facilityText}>Piscina</Text></View>
           <View style={styles.facilityItem}><WifiHigh size={24} color="#1ab65c" /><Text style={styles.facilityText}>Wi-Fi</Text></View>
           <View style={styles.facilityItem}><ForkKnife size={24} color="#1ab65c" /><Text style={styles.facilityText}>Cozinha</Text></View>
           <View style={styles.facilityItem}><Car size={24} color="#1ab65c" /><Text style={styles.facilityText}>Estacionamento</Text></View>
        </View>

        {/* LOCALIZAÇÃO */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Localização</Text>
        </View>
        
        <View style={styles.mapContainer}>
           <MapPin size={40} color="#1ab65c" weight="fill" />
           <Text style={{color: '#757575', marginTop: 10, fontWeight: 'bold'}}>Ver no Mapa</Text>
           <Text style={{color: '#555', fontSize: 12}}>{property.location}</Text>
        </View>

        {/* AVALIAÇÕES */}
        <View style={styles.sectionHeader}>
           <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
             <Text style={styles.sectionTitle}>Avaliações</Text>
             <Star size={18} color="#ffd700" weight="fill" />
             <Text style={{color: '#1ab65c', fontWeight: 'bold'}}>{property.rating || 4.8}</Text>
             <Text style={{color: '#757575'}}>({property.reviews || 10} avaliações)</Text>
           </View>
           <Text style={styles.sectionLink}>Ver Tudo</Text>
        </View>
        
        <View style={styles.reviewCard}>
           <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
              <View style={styles.avatarPlaceholder} /> 
              <View>
                 <Text style={{color: '#fff', fontWeight: 'bold'}}>Jenny Wilson</Text>
                 <Text style={{color: '#757575', fontSize: 12}}>10 Dez 2024</Text>
              </View>
              <View style={{flex: 1}} />
              <View style={styles.ratingBadge}>
                 <Star size={12} color="#fff" weight="fill" />
                 <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}}>5</Text>
              </View>
           </View>
           <Text style={styles.reviewText}>
             Muito bom e confortável!
           </Text>
        </View>

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerContainerText}>
          <Text style={styles.footerContainerTextMoney}>
            R$ {property.price ? property.price.toLocaleString('pt-BR') : '0'}
          </Text>
          <Text style={styles.footerContainerTextMonth}>
             {property.type === 'rent' ? '/ noite' : ' (venda)'}
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Reservar Agora!</Text>
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
    height: 300,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
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
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 1, 
  },
  separator:{
    height: 1,
    backgroundColor: "#333",
    marginHorizontal: 20,
    marginTop: 20,
  },
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
  contentPhotoContainer: {
    paddingLeft: 20,
    marginTop: 15,
  },
  contentPhotoImage: {
    width: 120,
    height: 80,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#333',
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between", 
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
  descriptionText: {
    color: "#757575",
    paddingHorizontal: 20,
    marginTop: 10,
    lineHeight: 20,
  },
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: 15,
    gap: 20,
  },
  facilityItem: {
    alignItems: "center",
    width: "20%", 
    gap: 5,
  },
  facilityText: {
    color: "#757575",
    fontSize: 12,
  },
  mapContainer: {
    height: 180,
    backgroundColor: "#2a2d35",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
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
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 90,
    backgroundColor: "#181a20",
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
