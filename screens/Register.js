import { useState, useEffect } from "react";
import { View, Text, TextInput, Image, Pressable, Alert, Button } from "react-native";
import { logout, signUp } from "../components/Auth";
import { onAuthStateChanged } from "firebase/auth";
import styles from "../style/styles.js";
import { auth } from "../firebase/Config";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { Picker } from "@react-native-picker/picker";
import { set } from "firebase/database";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Register({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const handlePressRegister = () => {
    if (!username) {
      Alert.alert("Username is required");
    } else if (!email) {
      Alert.alert("Email is required");
    } else if (!password) {
      Alert.alert("Password is required");
    } else if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
    } else if (!confirmPassword) {
      setPassword("");
      Alert.alert("Please confirm your password");
    } else {
      signUp(email, password, username);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          navigation.navigate("Groups");
        }
      });
    }
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

  const handlePressLogout = () => {
    logout();
  };

  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.button} onPress={handlePressLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Pressable
          //   onPress={() => navigation.goBack()}
          style={styles.backButton}></Pressable>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />
          <Button title="Upload Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
          <Button title="Take Photo" onPress={takePhoto} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        <Pressable style={styles.button} onPress={handlePressRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
        
      </View>
    );
  }
}
