import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const brazilianHotels = [
  {
    title: "Copacabana Royal Hotel",
    location: "Rio de Janeiro, RJ",
    price: 1250,
    type: "rent",
    rating: 4.9,
    reviews: 3200,
    description: "Ícone do Rio de Janeiro. Localizado em frente à famosa praia de Copacabana, este hotel oferece luxo clássico, piscina semi-olímpica e culinária premiada.",
    bedrooms: 2,
    bathrooms: 2,
    area: 65,
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop", // Quarto luxo
      "https://images.unsplash.com/photo-1518182170546-0766be6f5a56?q=80&w=1000&auto=format&fit=crop", // Vista Mar
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop"  // Piscina
    ],
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop", // Capa
    ownerId: "admin_system",
    createdAt: new Date().toISOString()
  },
  {
    title: "Pousada Brisa de Trancoso",
    location: "Trancoso, Bahia",
    price: 890,
    type: "rent",
    rating: 4.8,
    reviews: 540,
    description: "O charme rústico da Bahia com todo o conforto. Bangalôs privativos cercados pela mata nativa e a poucos passos do Quadrado.",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    images: [
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1000&auto=format&fit=crop", // Resort Tropical
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop", // Natureza
      "https://images.unsplash.com/photo-1571896349842-6e5a51335022?q=80&w=1000&auto=format&fit=crop"  // Quarto rústico
    ],
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1000&auto=format&fit=crop",
    ownerId: "admin_system",
    createdAt: new Date().toISOString()
  },
  {
    title: "Grand Hotel Paulista",
    location: "São Paulo, SP",
    price: 650,
    type: "rent",
    rating: 4.7,
    reviews: 1850,
    description: "Hospede-se no coração financeiro do Brasil. Próximo à Av. Paulista, com design moderno, rooftop bar e academia completa.",
    bedrooms: 1,
    bathrooms: 1,
    area: 38,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000&auto=format&fit=crop", // Hotel Urbano
      "https://images.unsplash.com/photo-1565031491048-48a32cdb11c0?q=80&w=1000&auto=format&fit=crop", // Interior moderno
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop"  // Lobby
    ],
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000&auto=format&fit=crop",
    ownerId: "admin_system",
    createdAt: new Date().toISOString()
  },
  {
    title: "Chalé Montanha de Gramado",
    location: "Gramado, RS",
    price: 520,
    type: "rent",
    rating: 4.9,
    reviews: 980,
    description: "Romantismo e aconchego na Serra Gaúcha. Chalé estilo alpino com lareira, banheira de hidromassagem e vista para o vale.",
    bedrooms: 2,
    bathrooms: 1,
    area: 70,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop", // Chalé/Resort Madeira
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop", // Neve/Frio vibe
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop"  // Interior Lareira
    ],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop",
    ownerId: "admin_system",
    createdAt: new Date().toISOString()
  },
  {
    title: "Amazon Eco Lodge",
    location: "Manaus, AM",
    price: 1100,
    type: "rent",
    rating: 4.8,
    reviews: 210,
    description: "Conexão total com a natureza. Hospede-se em bangalôs flutuantes no Rio Negro e acorde com o som da floresta amazônica.",
    bedrooms: 1,
    bathrooms: 1,
    area: 50,
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop", // Natureza
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000&auto=format&fit=crop", // Floresta
      "https://images.unsplash.com/photo-1533630713293-132d7332e928?q=80&w=1000&auto=format&fit=crop"  // Piscina natural
    ],
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop",
    ownerId: "admin_system",
    createdAt: new Date().toISOString()
  }
];

export const seedHotels = async () => {
  try {
    console.log("Iniciando cadastro de hotéis brasileiros...");
    const promises = brazilianHotels.map(hotel => addDoc(collection(db, "properties"), hotel));
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("Erro ao cadastrar hotéis:", error);
    return false;
  }
};