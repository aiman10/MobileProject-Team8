import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import styles from "../style/styles.js";
import LoginPage from "../screens/Login.js";
import RegisterPage from "../screens/Register.js";

export default function FrontPage() {
  const [currentView, setCurrentView] = useState("frontPage");

  const renderView = () => {
    switch (currentView) {
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      default:
        return (
          <View style={styles.container}>
            <Pressable
              style={styles.button}
              onPress={() => setCurrentView("login")}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => setCurrentView("register")}>
              <Text style={styles.buttonText}>Sign up</Text>
            </Pressable>
          </View>
        );
    }
  };

  return <View>{renderView()}</View>;
}
