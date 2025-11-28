// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// PASTE YOUR CONFIG HERE (The part starting with const firebaseConfig = { ... })
// It should look like this:
// const firebaseConfig = {
//   apiKey: "AIzaSy...",
//   authDomain: "...",
//   projectId: "...",
//   ...
// };
const firebaseConfig = {
  apiKey: "AIzaSyAttuGKl9DSMsSaCou4cLlc5DLGpJQ0SKA",
  authDomain: "studentfeedback-b5b4d.firebaseapp.com",
  projectId: "studentfeedback-b5b4d",
  storageBucket: "studentfeedback-b5b4d.firebasestorage.app",
  messagingSenderId: "374151403824",
  appId: "1:374151403824:web:b16b5c126c91cbdd6e10f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Database
export const db = getFirestore(app);