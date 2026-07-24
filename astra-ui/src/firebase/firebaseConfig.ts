import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBOLw6dsMixpQIV8swipIhDRHwUEihq31s",
  authDomain: "astra-to-all-stars.firebaseapp.com",
  projectId: "astra-to-all-stars",
  storageBucket: "astra-to-all-stars.firebasestorage.app",
  messagingSenderId: "25426964285",
  appId: "1:25426964285:web:22fde42b8dbe44d6a29f54",
};


const app = initializeApp(firebaseConfig);


// Firebase Authentication
export const auth = getAuth(app);


// Firebase Firestore Database
export const db = getFirestore(app);