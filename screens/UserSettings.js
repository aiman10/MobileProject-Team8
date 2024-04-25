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
import { onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import styles from "../style/styles.js";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { deleteUser } from "../components/Auth.js";
import { deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase/Config";

export default function ProfileSettings({ navigation }) {
const [user, setUser] = useState(null);
const [newUsername, setNewUsername] = useState("");
const [newEmail, setNewEmail] = useState("");
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [image, setImage] = useState(null);

useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    if (currentUser) {
        setNewUsername(currentUser.displayName);
        setNewEmail(currentUser.email);
    }
    });
}, []);

const updateUserProfile = async (newUsername, newEmail, newPassword, newImageUri) => {
    try {
    const user = auth.currentUser;
    
    if (newUsername || newImageUri) {
        await updateProfile(user, {
        displayName: newUsername ?? user.displayName,
        photoURL: newImageUri ?? user.photoURL,
        });
        console.log("Profile updated successfully.");      }

    if (newEmail) {
        await user.updateEmail(newEmail);
        console.log("Email updated successfully.");
    }
    if (newPassword) {
        await user.updatePassword(newPassword);
        console.log("Password updated successfully.");
    }

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
        username: newUsername,
        email: newEmail,
        // image missing
    });
    console.log("Firestore profile updated successfully.");

    } catch (error) {
    console.error("Error updating profile: ", error);
    throw error;
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
    if (newUsername) {
    await updateUserProfile(user, newUsername, image); 
    }
    if (newEmail && newEmail !== user.email) {
    await updateEmail(user, newEmail);
    }
    if (currentPassword && newPassword && newPassword !== currentPassword) {
    await updatePassword(user, newPassword);
    }
    Alert.alert("Profile updated successfully");
    setNewPassword("");
    setCurrentPassword("");
    
};

const handleDeleteAccount = async () => {
    Alert.alert("Confirm", "Are you sure you want to delete your account?", [
    { text: "Cancel", style: "cancel" },
    { text: "OK", onPress: () => deleteUserAccount(user) },
    ]);
};

const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
    Alert.alert('Permission to access camera roll is required!');
    return;}
    try {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [26, 10],
        quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
        setUploadImage(result.assets[0].uri);
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
        aspect: [26, 10],
        quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
        setUploadImage(result.assets[0].uri);
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
        placeholder="New Email"
        value={newEmail}
        onChangeText={setNewEmail}
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
    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    <Button title="Take New Photo" onPress={takePhoto} />
    {image && <Image source={{ uri: image }} style={styles.avatar} />}
    <Pressable style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
    </Pressable>
    <Pressable style={styles.button} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
    </Pressable>
    </View>
);
}