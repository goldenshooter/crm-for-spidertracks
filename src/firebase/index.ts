import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyC4dYCYLKqvEnCbqjxLNlN6V2oNcEGyswA",
  authDomain: "crm-for-spidertrack.firebaseapp.com",
  projectId: "crm-for-spidertrack",
  storageBucket: "crm-for-spidertrack.appspot.com",
  messagingSenderId: "137218212415",
  appId: "1:137218212415:web:0b5ef8bd390f8dcc3fee8a",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDatabase = getFirestore(firebaseApp);
