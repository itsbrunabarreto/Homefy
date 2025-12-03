import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Ajuste o caminho conforme sua estrutura

// Dados fictícios (Mock Data)
const mockProperties = [
  {
    title: "Mansão de Luxo em Beverly Hills",
    location: "Los Angeles, CA",
    price: 15000000,
    type: "sale",
    bedrooms: 6,
    bathrooms: 7,
    area: 850,
    description: "Mansão incrível com vista para a cidade.",
    image: "https://images.unsplash.com/photo-1600596542815-2495db98dada?q=80&w=1000&auto=format&fit=crop", 
    ownerId: "admin_demo",
    createdAt: new Date().toISOString()
  },
  {
    title: "Apartamento Compacto Centro",
    location: "São Paulo, SP",
    price: 450000,
    type: "sale",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    description: "Perto do metrô, ideal para estudantes.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop",
    ownerId: "admin_demo",
    createdAt: new Date().toISOString()
  },
  {
    title: "Casa de Praia Aconchegante",
    location: "Florianópolis, SC",
    price: 850, // Aluguel por dia (Airbnb style)
    type: "rent",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    description: "Pé na areia com área de churrasco.",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop",
    ownerId: "admin_demo",
    createdAt: new Date().toISOString()
  },
  {
    title: "Loft Industrial Moderno",
    location: "Nova York, EUA",
    price: 2500,
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    area: 70,
    description: "Estilo industrial com tijolos aparentes.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop",
    ownerId: "admin_demo",
    createdAt: new Date().toISOString()
  },
  {
    title: "Chácara Recanto Verde",
    location: "Interior de SP",
    price: 600,
    type: "rent",
    bedrooms: 4,
    bathrooms: 3,
    area: 2000,
    description: "Muita natureza e tranquilidade para família.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop",
    ownerId: "admin_demo",
    createdAt: new Date().toISOString()
  }
];

export const seedDatabase = async () => {
  try {
    console.log("Iniciando upload dos dados...");
    
    const promises = mockProperties.map(prop => 
      addDoc(collection(db, "properties"), prop)
    );

    await Promise.all(promises);
    
    console.log("Sucesso! Todos os imóveis foram cadastrados.");
    return true;
  } catch (error) {
    console.error("Erro ao semear banco de dados:", error);
    return false;
  }
};