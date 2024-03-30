import { Alert } from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { auth, db, USERS_REF } from "../firebase/Config";

export const signUp = async (email, password, username) => {
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setDoc(doc(db, USERS_REF, userCredential.user.uid), {
        username: username,
        email: userCredential.user.email,
      });
    })
    .catch((error) => {
      console.log("Registration failed " + error.message);
      Alert.alert("Registration failed", error.message);
    });
};

export const signIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed in");
    })
    .catch((error) => {
      console.log("Sign in failed " + error.message);
      Alert.alert("Sign in failed", error.message);
    });
};

export const logout = async () => {
  await signOut(auth)
    .then(() => {
      console.log("User signed out");
    })
    .catch((error) => {
      console.log("Logout failed " + error.message);
      Alert.alert("Logout failed", error.message);
    });
};
