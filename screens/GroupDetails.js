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
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const groupRef = doc(db, GROUPS_REF, groupId);
      const groupSnapshot = await getDoc(groupRef);
      if (groupSnapshot.exists()) {
        setGroupName(groupSnapshot.data().name);
        setMembers(groupSnapshot.data().members);
      } else {
        Alert.alert("Group not found");
      }
    };

    const getFirstUserName = async () => {
      const userRef = doc(db, USERS_REF, members[0]);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        console.log(userSnapshot.data().username);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group Details For: {groupName}</Text>
      {(!members || members.length === 0) && (
        <Text>No members in this group</Text>
      )}
      <FlatList
        data={members}
        renderItem={({ item }) => (
          <View style={styles.groupMember}>
            <Text>{item}</Text>
          </View>
        )}
        keyExtractor={(item) => item}
      />
      <Pressable
        style={styles.groupButtonStyle}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={20} color="white" />
        <Text style={styles.buttonText}>Back to Groups</Text>
      </Pressable>
    </View>
  );
}
