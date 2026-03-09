import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// REMPLACEZ PAR VOTRE CONFIGURATION !
const firebaseConfig = {
  apiKey: "AIzaSyCMCQbEKMaDe1XWp1gQQGWnct0NTKwCvvM",
  authDomain: "budget-app-8d0eb.firebaseapp.com",
  projectId: "budget-app-8d0eb",
  storageBucket: "budget-app-8d0eb.firebasestorage.app",
  messagingSenderId: "337407119141",
  appId: "1:337407119141:web:704ed5a3a6fdfb6caa14cc"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser l'authentification
export const auth = getAuth(app);

// Initialiser Firestore
export const db = getFirestore(app);

export default app;
