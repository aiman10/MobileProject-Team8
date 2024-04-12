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
  deleteDoc,
} from "firebase/firestore";
import { ActivityIndicator, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import DropdownMenu from "../components/DropdownMenu.js";

export default function GroupDetails({ route, navigation }) {
  const { groupId } = route.params;
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const menuOptions = [
    {
      label: "Delete Group",
      onPress: () => {
        Alert.alert(
          "Delete Group",
          "Are you sure you want to delete this group?",
          [
            {
              text: "Cancel",
              onPress: () => setModalVisible(false),
            },
            {
              text: "Delete",
              onPress: () => {
                deleteGroup();
              },
            },
          ]
        );
      },
    },
  ];

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

  const deleteGroup = async () => {
    const groupRef = doc(db, GROUPS_REF, groupId);
    await deleteDoc(groupRef);
    const userGroupQuery = query(
      collection(db, USER_GROUPS_REF),
      where("groupId", "==", groupId)
    );
    const userGroupSnapshot = await getDocs(userGroupQuery);
    userGroupSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    navigation.navigate("Groups");
  };

  const getFirstUserName = async () => {
    const userRef = doc(db, USERS_REF, members[0]);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      console.log(userSnapshot.data().username);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <Pressable onPress={() => setModalVisible(true)}>
            <Ionicons
              name="settings"
              size={24}
              color="black"
              style={{ marginRight: 15 }}
            />
          </Pressable>
          <DropdownMenu
            isVisible={modalVisible}
            onClose={() => setModalVisible(false)}
            menuOptions={menuOptions}
          />
        </>
      ),
    });

    fetchGroupDetails();
  }, [navigation, modalVisible, groupId]);

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
    </View>
  );
}
