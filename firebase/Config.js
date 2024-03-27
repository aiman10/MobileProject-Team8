// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBomudyOWpyZCkU3t2bX00821BFguE3ZEg",
  authDomain: "mobile-project-e2622.firebaseapp.com",
  projectId: "mobile-project-e2622",
  storageBucket: "mobile-project-e2622.appspot.com",
  messagingSenderId: "847566858167",
  appId: "1:847566858167:web:c93579b908e0c3e0f12a32",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const USERS_REF = "users";
export const GROUPS_REF = "groups";
