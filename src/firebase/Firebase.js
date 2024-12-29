// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvBiWlEXfhm9S_V9tP1-aU4GuDRiZS_KI",
  authDomain: "curetica-6b0db.firebaseapp.com",
  projectId: "curetica-6b0db",
  storageBucket: "curetica-6b0db.firebasestorage.app",
  messagingSenderId: "656463687656",
  appId: "1:656463687656:web:75e14e20cc4ed7c134fe5d",
  measurementId: "G-D6FZSS865B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);