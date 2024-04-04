import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert, Button } from "react-native";
import { logout, signIn } from "../components/Auth";
import { onAuthStateChanged } from "firebase/auth";
import styles from "../style/styles.js";
import { auth } from "../firebase/Config";
import { Ionicons } from "@expo/vector-icons";
import Groups from "./Groups.js";

export default function Login({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const handlePressLogin = () => {
    if (!email) {
      Alert.alert("Email is required");
    } else if (!password) {
      Alert.alert("Password is required");
    } else {
      signIn(email, password);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setEmail("");
          setPassword("");
        }
      });
    }
  };

  const handlePressLogout = () => {
    logout();
  };

  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <Groups />
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
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.infoText}>Login</Text>
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
        <Pressable style={styles.button} onPress={handlePressLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
    );
  }
}
