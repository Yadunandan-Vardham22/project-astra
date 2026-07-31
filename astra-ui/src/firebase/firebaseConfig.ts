import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Read Firebase config from Vite env vars (VITE_FIREBASE_*)
// Create a `.env.local` in `astra-ui/` for your development keys.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

if (!firebaseConfig.projectId) {
  console.warn(
    "Firebase config appears empty — make sure you have a .env.local with VITE_FIREBASE_* values"
  );
}

const app = initializeApp(firebaseConfig);  

// Firebase Authentication
export const auth = getAuth(app);

// Firebase Firestore Database
export const db = getFirestore(app);

// Firebase Storage
export const storage = getStorage(app);

// Initialize Analytics only in browser and when measurement id is provided
if (typeof window !== "undefined" && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  import("firebase/analytics")
    .then(({ getAnalytics }) => {
      try {
        getAnalytics(app);
      } catch (e) {
        console.warn("Firebase analytics init failed:", e);
      }
    })
    .catch((err) => {
      console.warn("Failed to load firebase analytics module:", err);
    });
}