// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
     apiKey: "AIzaSyCQSNWEFfEyOP-Afv5oQoxpTAbLtx9aJXQ",
     authDomain: "house-marketplace-app-632b8.firebaseapp.com",
     projectId: "house-marketplace-app-632b8",
     storageBucket: "house-marketplace-app-632b8.appspot.com",
     messagingSenderId: "42623403923",
     appId: "1:42623403923:web:be4b94551f823dcc558a66",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
