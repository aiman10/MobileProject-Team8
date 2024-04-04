import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  Button,
  TextInput,
  FlatList,
} from "react-native";
import styles from "../style/styles.js";
import {
  auth,
  db,
  USERS_REF,
  USER_GROUPS_REF,
  GROUPS_REF,
} from "../firebase/Config";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { ActivityIndicator, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export default function GroupDetails({ route, navigation }) {
  const { groupId } = route.params;
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const groupRef = doc(db, GROUPS_REF, groupId);
      const groupSnapshot = await getDoc(groupRef);
      if (groupSnapshot.exists()) {
        setGroupName(groupSnapshot.data().name);
      } else {
        Alert.alert("Group not found");
      }
    };
    fetchGroupDetails();
  }, [groupId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group Details For: {groupName}</Text>

      <Pressable
        style={styles.groupButtonStyle}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={20} color="white" />
        <Text style={styles.buttonText}>Back to Groups</Text>
      </Pressable>
    </View>
  );
}
