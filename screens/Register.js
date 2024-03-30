import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert, Button } from "react-native";
import { logout, signUp } from "../components/Auth";
import { onAuthStateChanged } from "firebase/auth";
import styles from "../style/styles.js";
import { auth } from "../firebase/Config";
import { MaterialIcons } from "@expo/vector-icons";

export default function Register({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
          navigation.navigate("Todos");
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
        <Text>You are logged in</Text>
        <Pressable style={styles.button} onPress={handlePressLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
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
        <Pressable style={styles.button} onPress={handlePressRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
        <Text style={styles.infoText}>Already have an account? </Text>
        <Pressable
          style={styles.buttonStyle}
          onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
    );
  }
}
