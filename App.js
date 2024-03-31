import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db, GROUPS_REF, USERS_REF } from "./firebase/Config";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import styles from "./style/styles";
import FrontPage from "./screens/FrontPage";

export default function App() {
  return (
    <View style={styles.container}>
      <FrontPage />
    </View>
  );
}
