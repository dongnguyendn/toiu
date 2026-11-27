import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBvRXBfNt6MsNapxcorzT6MftL8r5oSaBU",
  authDomain: "toiuuhoalotrinh.firebaseapp.com",
  projectId: "toiuuhoalotrinh",
  storageBucket: "toiuuhoalotrinh.firebasestorage.app",
  messagingSenderId: "592662165968",
  appId: "1:592662165968:web:c7921213de867e80a261d5",
  measurementId: "G-F7VP64BREM"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
