// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import AsyncStorages from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  //apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  apiKey: "AIzaSyBomudyOWpyZCkU3t2bX00821BFguE3ZEg",
  authDomain: "mobile-project-e2622.firebaseapp.com",
  projectId: "mobile-project-e2622",
  storageBucket: "mobile-project-e2622.appspot.com",
  messagingSenderId: "847566858167",
  appId: "1:847566858167:web:c93579b908e0c3e0f12a32",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorages),
});
export { auth };

export const db = getFirestore(app);
export const USERS_REF = "users";
export const GROUPS_REF = "groups";
