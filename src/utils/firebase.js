
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9YmWGT-QCmDUPLYwfVZsobDGZG3jwmkY",
  authDomain: "nsc-requestportal.firebaseapp.com",
  projectId: "nsc-requestportal",
  storageBucket: "nsc-requestportal.appspot.com",
  messagingSenderId: "618913339110",
  appId: "1:618913339110:web:30d5ba0c6d5bf66f31cd27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };