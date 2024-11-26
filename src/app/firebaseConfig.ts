import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBn77hs3...",
  authDomain: "poker-lab-app.firebaseapp.com",
  projectId: "poker-lab-app",
  storageBucket: "poker-lab-app.appspot.com",
  messagingSenderId: "837402802874",
  appId: "1:837402802874:web:9df0708877f3ebf0e66083",
  measurementId: "G-6N0NVZ0CJW",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);