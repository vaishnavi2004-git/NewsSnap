// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDDCQ0zUZLzBqX-6LvD41pgKQ7RllSkJ2I",
  authDomain: "newssnap-be84d.firebaseapp.com",
  projectId: "newssnap-be84d",
  storageBucket: "newssnap-be84d.firebasestorage.app",
  messagingSenderId: "597196619533",
  appId: "1:597196619533:web:483d46062bc446daa27a44",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
