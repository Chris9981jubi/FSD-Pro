// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-app-4aee0.firebaseapp.com",
  projectId: "real-estate-app-4aee0",
  storageBucket: "real-estate-app-4aee0.appspot.com",
  messagingSenderId: "186617998604",
  appId: "1:186617998604:web:08aaa1a268a39738ec6d29"
};

const app = initializeApp(firebaseConfig);

export default app;