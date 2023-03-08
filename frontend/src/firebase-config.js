// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkLbD0J4FgrTfkOqLMeXlaEmloB4kjnEk",
  authDomain: "mindfuljournal-44166.firebaseapp.com",
  projectId: "mindfuljournal-44166",
  storageBucket: "mindfuljournal-44166.appspot.com",
  messagingSenderId: "1079920932248",
  appId: "1:1079920932248:web:3249be9aad3787f6eba7ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);