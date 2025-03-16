import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAVZBYIviuhJdYckDLb8tiZ_kvuQPkkdCU",
    authDomain: "bananagame-dd40f.firebaseapp.com",
    projectId: "bananagame-dd40f",
    storageBucket: "bananagame-dd40f.firebasestorage.app",
    messagingSenderId: "341334265050",
    appId: "1:341334265050:web:a1f4b1b19e5fb2c4c569e3",
    measurementId: "G-RDCCHKNG0N"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();