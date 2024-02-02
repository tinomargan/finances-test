// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCIEAAM8dtLLjdZqUKKRLT3d19hiEmnZS4",
    authDomain: "finances-f1800.firebaseapp.com",
    projectId: "finances-f1800",
    storageBucket: "finances-f1800.appspot.com",
    messagingSenderId: "684587181593",
    appId: "1:684587181593:web:228ccd5abd1dc5ef456c88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
