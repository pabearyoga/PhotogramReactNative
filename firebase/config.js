import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAr7lE4bByl8EaK0Bji-l6eAzh_575-Z9c",
  authDomain: "reactnatine.firebaseapp.com",
  projectId: "reactnatine",
  storageBucket: "reactnatine.appspot.com",
  messagingSenderId: "882128343506",
  appId: "1:882128343506:web:d9afe5aa77f7d1b389f80b",
  measurementId: "G-B5ZSQSD3LH",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
