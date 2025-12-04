import React, { useState } from "react";
import { 
  View, Text, TextInput, StyleSheet, ScrollView, 
  TouchableOpacity, Image, Alert, ActivityIndicator, FlatList 
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { 
  ArrowLeft, Camera, House, CurrencyDollar, 
  Bed, Bathtub, ArrowsOutSimple, XCircle 
} from "phosphor-react-native";

// Firebase
import { auth, db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function AddProperty() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados do Formulário
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  
  // Detalhes
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  
  // Tipo: Venda ou Aluguel
  const [type, setType] = useState<"sale" | "rent">("sale");
  
  // --- MUDANÇA AQUI: Array de imagens ---
  const [images, setImages] = useState<string[]>([]);

  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Se quiser permitir edição individual
        aspect: [4, 3],
        quality: 0.2, // Mantém baixo para não estourar o banco
        base64: true,
        // selectionLimit: 5, // (Opcional) Limita quantas de uma vez no Android 13+/iOS 14+
        allowsMultipleSelection: false // O "allowsEditing" geralmente conflita com seleção múltipla, então vamos adicionar uma por uma
      });

      if (!result.canceled && result.assets[0].base64) {
        const newImage = `data:image/jpeg;base64,${result.assets[0].base64}`;
        // Adiciona a nova imagem à lista existente
        setImages((prevImages) => [...prevImages, newImage]);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  }

  // Função para remover uma imagem da lista antes de enviar
  function removeImage(indexToRemove: number) {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  }

  async function handlePublish() {
    if (!title || !price || images.length === 0) {
      Alert.alert("Atenção", "Preencha título, preço e adicione pelo menos uma foto.");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não logado");

      await addDoc(collection(db, "properties"), {
        ownerId: user.uid,
        ownerName: user.displayName || "Anunciante",
        title,
        description,
        location,
        price: parseFloat(price),
        type, 
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        area: parseInt(area) || 0,
        
        // --- MUDANÇA AQUI: Salvando a lista e definindo a primeira como capa ---
        images: images, 
        image: images[0], // Mantém esse campo para compatibilidade com o código antigo da Home/Search
        
        createdAt: new Date().toISOString()
      });

      Alert.alert("Sucesso", "Seu imóvel foi anunciado!");
      router.back();

    } catch (error: any) {
      console.error(error);
      
      if (error.message && error.message.includes("size")) {
        Alert.alert("Erro", "As imagens são muito grandes. Tente adicionar menos fotos.");
      } else {
        Alert.alert("Erro", "Não foi possível anunciar: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#f4f4f4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Anunciar Imóvel</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- ÁREA DE FOTOS (Carrossel Horizontal) --- */}
        <Text style={styles.label}>Fotos do Imóvel ({images.length})</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
          {/* Botão de Adicionar (Sempre visível no começo) */}
          <TouchableOpacity style={styles.addPhotoButton} onPress={handleSelectImage}>
            <Camera size={32} color="#1ab65c" />
            <Text style={styles.addPhotoText}>Adicionar</Text>
          </TouchableOpacity>

          {/* Lista das fotos selecionadas */}
          {images.map((imgUri, index) => (
            <View key={index} style={styles.photoWrapper}>
              <Image source={{ uri: imgUri }} style={styles.thumbnail} />
              
              {/* Botão de Remover (X) */}
              <TouchableOpacity 
                style={styles.removeButton} 
                onPress={() => removeImage(index)}
              >
                <XCircle size={20} color="#ff4d4d" weight="fill" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* TIPO DE ANÚNCIO */}
        <View style={styles.typeContainer}>
          <TouchableOpacity 
            style={[styles.typeButton, type === "sale" && styles.typeButtonActive]}
            onPress={() => setType("sale")}
          >
            <Text style={[styles.typeText, type === "sale" && styles.typeTextActive]}>Venda</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.typeButton, type === "rent" && styles.typeButtonActive]}
            onPress={() => setType("rent")}
          >
            <Text style={[styles.typeText, type === "rent" && styles.typeTextActive]}>Aluguel</Text>
          </TouchableOpacity>
        </View>

        {/* INPUTS GERAIS */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título do Anúncio</Text>
          <View style={styles.inputContainer}>
            <House size={20} color="#757575" />
            <TextInput 
              style={styles.input} 
              placeholder="Ex: Apartamento no Centro" 
              placeholderTextColor="#555"
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição</Text>
          <View style={[styles.inputContainer, { height: 100, alignItems: 'flex-start', paddingTop: 10 }]}>
            <TextInput 
              style={[styles.input, { textAlignVertical: 'top' }]} 
              placeholder="Descreva o imóvel..." 
              placeholderTextColor="#555"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preço (R$)</Text>
          <View style={styles.inputContainer}>
            <CurrencyDollar size={20} color="#757575" />
            <TextInput 
              style={styles.input} 
              placeholder="0,00" 
              placeholderTextColor="#555"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Quartos</Text>
            <View style={styles.inputContainer}>
              <Bed size={20} color="#757575" />
              <TextInput 
                style={styles.input} 
                placeholder="0" 
                placeholderTextColor="#555"
                keyboardType="numeric"
                value={bedrooms}
                onChangeText={setBedrooms}
              />
            </View>
          </View>

          <View style={{ width: 10 }} />

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Banheiros</Text>
            <View style={styles.inputContainer}>
              <Bathtub size={20} color="#757575" />
              <TextInput 
                style={styles.input} 
                placeholder="0" 
                placeholderTextColor="#555"
                keyboardType="numeric"
                value={bathrooms}
                onChangeText={setBathrooms}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Área (m²)</Text>
            <View style={styles.inputContainer}>
              <ArrowsOutSimple size={20} color="#757575" />
              <TextInput 
                style={styles.input} 
                placeholder="Ex: 120" 
                placeholderTextColor="#555"
                keyboardType="numeric"
                value={area}
                onChangeText={setArea}
              />
            </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Localização</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input} 
              placeholder="Cidade, Estado" 
              placeholderTextColor="#555"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.publishButton} 
          onPress={handlePublish}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.publishButtonText}>Publicar Imóvel</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181a20",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: "#f4f4f4",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  // --- ESTILOS DAS FOTOS ---
  photosContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    backgroundColor: "#1f222a",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    borderStyle: "dashed",
    marginRight: 10,
  },
  addPhotoText: {
    color: "#1ab65c",
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold'
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  // --- OUTROS ESTILOS (IGUAIS) ---
  typeContainer: {
    flexDirection: "row",
    backgroundColor: "#1f222a",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  typeButtonActive: {
    backgroundColor: "#1ab65c",
  },
  typeText: {
    color: "#757575",
    fontWeight: "600",
  },
  typeTextActive: {
    color: "#fff",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#f4f4f4",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f222a",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
  },
  input: {
    flex: 1,
    color: "#f4f4f4",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
  },
  publishButton: {
    backgroundColor: "#1ab65c",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  publishButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});