import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAVZBYIviuhJdYckDLb8tiZ_kvuQPkkdCU",
  authDomain: "bananagame-dd40f.firebaseapp.com",
  projectId: "bananagame-dd40f",
  storageBucket: "bananagame-dd40f.firebasestorage.app",
  messagingSenderId: "341334265050",
  appId: "1:341334265050:web:a1f4b1b19e5fb2c4c569e3",
  measurementId: "G-RDCCHKNG0N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);