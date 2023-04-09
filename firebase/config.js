import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";

const firebaseConfig = {
  apiKey: "AIzaSyA2SdoPMSsb7cmTjBzqvDnqe714d5Zek04",
  authDomain: "photogram-81530.firebaseapp.com",
  projectId: "photogram-81530",
  storageBucket: "photogram-81530.appspot.com",
  messagingSenderId: "793678575749",
  appId: "1:793678575749:web:37d0e25d1c16a80c2751ec",
  measurementId: "G-0EN5G0S2G8",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
