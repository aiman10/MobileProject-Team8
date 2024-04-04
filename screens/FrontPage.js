import React from "react";
import { View, Text, Pressable } from "react-native";
import styles from "../style/styles";

export default function FrontPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Register")}>
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
    </View>
  );
}
