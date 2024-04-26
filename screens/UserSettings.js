import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  Alert,
  Button,
} from "react-native";
import { updateUserProfile, deleteUserAccount } from "../components/Auth.js";
import {
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import * as ImagePicker from "expo-image-picker";
import styles from "../style/styles.js";
import { updateProfile } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { deleteUser } from "../components/Auth.js";
import { auth, db, USERS_REF } from "../firebase/Config";
import { set } from "firebase/database";

export default function ProfileSettings({ navigation }) {
  //const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    //console.log("User useEffect:", user.uid);
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const userRef = doc(db, USERS_REF, user.uid);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      //console.log("User data:", userData);
    }
  };

  const updateUsername = async () => {
    const userRef = doc(db, USERS_REF, user.uid);
    await updateDoc(userRef, {
      username: newUsername,
    });
    setNewUsername("");
  };

  const updateUserImage = async () => {
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImageToStorage(
        image,
        `userImages/${new Date().getTime()}`
      );
    }
    const userRef = doc(db, USERS_REF, user.uid);
    await updateDoc(userRef, {
      userImage: imageUrl,
    });
    console.log("User image updated successfully.");
    setImage(null);
  };

  const changePassword = async () => {
    try {
      await updatePassword(user, newPassword);
      console.log("Password updated successfully.");
      setNewPassword("");
      setCurrentPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const deleteUserAccount = async () => {
    const user = auth.currentUser;

    try {
      await deleteUser(user);
      console.log("User account deleted successfully.");

      const userRef = doc(db, "users", user.uid);
      await deleteDoc(userRef);
      console.log("User data deleted from Firestore successfully.");
    } catch (error) {
      console.error("Error deleting user account: ", error);
      throw error;
    }
  };

  const handleUpdateProfile = async () => {
    if (image) {
      await updateUserImage();
    } else if (newUsername) {
      await updateUsername();
    } else if (
      currentPassword &&
      newPassword &&
      currentPassword !== newPassword
    ) {
      await changePassword();
    } else {
      Alert.alert(
        "Please enter a new password that is different from your current password."
      );
    }

    if (!newUsername && !newEmail && !newPassword && !image) {
      Alert.alert("Please fill in the fields to update your profile.");
    }
    //Alert.alert("Profile updated successfully");
  };

  const handleDeleteAccount = async () => {
    Alert.alert("Confirm", "Are you sure you want to delete your account?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => deleteUserAccount(user) },
    ]);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.assets[0].uri);
        //console.log("Picked image URI:", result.assets[0].uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.assets[0].uri);
        //console.log("Photo URI:", result.assets[0].uri);
      }
    } catch (e) {
      console.error("Error taking photo:", e);
    }
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Settings</Text>
      <TextInput
        style={styles.input}
        placeholder="New Username"
        value={newUsername}
        onChangeText={setNewUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={true}
      />
      <Button title="Change Image" onPress={pickImage} />

      <Button title="Take New Photo" onPress={takePhoto} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <Pressable style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </Pressable>
    </View>
  );
}
