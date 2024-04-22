import { Alert } from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { auth, db, USERS_REF } from "../firebase/Config";

export const signUp = async (email, password, username,image) => {
  let imageUrl = null;
  if (image) {
    imageUrl = await uploadImageToStorage(
      image,
      `userImages/${new Date().getTime()}`
    );
  }
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setDoc(doc(db, USERS_REF, userCredential.user.uid), {
        username: username,
        email: userCredential.user.email,
        userImage, imageUrl
      });
    })
    .catch((error) => {
      console.log("Registration failed " + error.message);
      Alert.alert("Registration failed", error.message);
    });
};

const uploadImageToStorage = async (fileUri, path) => {
  const response = await fetch(fileUri);
  const blob = await response.blob();
  const storage = getStorage();
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, blob);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
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
