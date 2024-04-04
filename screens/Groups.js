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

export default function Groups() {
  const [groupName, setGroupName] = useState("");
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchUserGroups();
  }, []);

  const fetchUserGroups = async () => {
    //setIsLoading(true);
    const q = query(
      collection(db, USER_GROUPS_REF),
      where("userId", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const groupFetchPromises = querySnapshot.docs.map(async (docSnapshot) => {
      const groupRef = docSnapshot.data().groupId;
      const groupSnapshot = await getDoc(groupRef);
      if (groupSnapshot.exists()) {
        return { id: groupSnapshot.id, ...groupSnapshot.data() };
      } else {
        console.error("Group not found");
        return null;
      }
    });

    const groups = (await Promise.all(groupFetchPromises)).filter(Boolean);
    setUserGroups(groups);
    setIsLoading(false);
  };

  const createGroup = async () => {
    try {
      const groupRef = await addDoc(collection(db, GROUPS_REF), {
        name: groupName,
      });

      await addDoc(collection(db, USER_GROUPS_REF), {
        userId: auth.currentUser.uid,
        groupId: groupRef,
      });

      //Alert.alert("Group created successfully");
      setGroupName("");
      fetchUserGroups();
      setIsModalVisible(false);
    } catch (error) {
      // Alert.alert("Error creating group");
      console.error("Error creating group", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Groups</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={userGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>{item.name}</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="#000"
                style={styles.iconStyle}
              />
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.infoText}>No Groups yet</Text>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <Button title="Add Group" onPress={() => setIsModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Create a new group</Text>
            <TextInput
              placeholder="Group Name"
              value={groupName}
              onChangeText={setGroupName}
              style={styles.modalInput}
            />
            <Button title="Create Group" onPress={createGroup} />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
