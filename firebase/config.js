// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAr7lE4bByl8EaK0Bji-l6eAzh_575-Z9c",
  authDomain: "reactnatine.firebaseapp.com",
  projectId: "reactnatine",
  storageBucket: "reactnatine.appspot.com",
  messagingSenderId: "882128343506",
  appId: "1:882128343506:web:d9afe5aa77f7d1b389f80b",
  measurementId: "G-B5ZSQSD3LH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
