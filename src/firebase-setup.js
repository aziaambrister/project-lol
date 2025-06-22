// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZzw7DNhnwF2kUT47u4-NNM0cGe47RAmQ",
  authDomain: "d-game-78982.firebaseapp.com",
  projectId: "d-game-78982",
  storageBucket: "d-game-78982.firebasestorage.app",
  messagingSenderId: "562825312065",
  appId: "1:562825312065:web:e2f6b003fd1c02899e13c0",
  measurementId: "G-PX9PD7THS4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);