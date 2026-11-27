import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvRXBfNt6MsNapxcorzT6MftL8r5oSaBU",
  authDomain: "toiuuhoalotrinh.firebaseapp.com",
  projectId: "toiuuhoalotrinh",
  storageBucket: "toiuuhoalotrinh.firebasestorage.app",
  messagingSenderId: "592662165968",
  appId: "1:592662165968:web:c7921213de867e80a261d5",
  measurementId: "G-F7VP64BREM"
};

async function test() {
  try {
    console.log("Initializing Firebase...");
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log("Firebase initialized. Listing collections/test...");
    const colInstance = collection(db, "test_connection");
    const docRef = await addDoc(colInstance, { timestamp: new Date().toISOString(), message: "Hello from Code Agent!" });
    console.log("Added test document with ID:", docRef.id);
  } catch (error) {
    console.error("Firebase Test Error:", error);
  }
}
test();
