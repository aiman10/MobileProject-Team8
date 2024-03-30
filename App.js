import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db, GROUPS_REF, USERS_REF } from "./firebase/Config";

import FrontPage from "./screens/FrontPage";

export default function App() {
  return (
    <View style={styles.container}>
      <FrontPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
