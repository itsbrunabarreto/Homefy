import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlTls9zLxXjnXGU-zTgBmUmvTAR33Bbr4",
  authDomain: "homefy-app-c01ad.firebaseapp.com",
  projectId: "homefy-app-c01ad",
  storageBucket: "homefy-app-c01ad.appspot.com",  
  messagingSenderId: "4589417936",
  appId: "1:4589417936:web:75b217fe6f5598fe1bf5d5",
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);