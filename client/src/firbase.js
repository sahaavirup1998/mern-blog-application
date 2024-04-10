// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-app-5b925.firebaseapp.com",
  projectId: "mern-blog-app-5b925",
  storageBucket: "mern-blog-app-5b925.appspot.com",
  messagingSenderId: "696901209281",
  appId: "1:696901209281:web:4596bf054014190f241840"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);