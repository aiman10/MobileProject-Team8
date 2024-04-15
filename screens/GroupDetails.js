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
import { set } from "firebase/database";

export default function GroupDetails({ route, navigation }) {
  const { groupId } = route.params;
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberUsernames, setMemberUsernames] = useState([]);

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

  const getUsername = async (userId) => {
    const userRef = doc(db, USERS_REF, userId);
    const userSnapshot = await getDoc(userRef);
    console.log(userSnapshot.data().name);
    return userSnapshot.data().name;
  };

  const createExpense = async () => {
    if (!expenseAmount || !expenseTitle) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    const expenseData = {
      amount: parseFloat(expenseAmount),
      title: expenseTitle,
      groupId: groupId,
      paidBy: auth.currentUser.uid, // Assuming the current user is paying TODO
      splitBetween: selectedMembers,
    };

    try {
      const expenseRef = await addDoc(collection(db, "expenses"), expenseData);
      const groupExpenseData = {
        expenseId: expenseRef.id,
        groupId: groupId,
      };
      await addDoc(collection(db, "group_expenses"), groupExpenseData);
      setExpenseModalVisible(false);
    } catch (error) {
      console.error("Error adding expense", error);
      Alert.alert("Error", "There was an issue adding the expense.");
    }
  };

  const handleSelectMember = (member) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers(selectedMembers.filter((m) => m !== member));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const cancelCreateExpense = () => {
    setExpenseModalVisible(false);
    setExpenseAmount("");
    setExpenseTitle("");
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
    <View style={[styles.container, { marginTop: -25 }]}>
      <Text style={styles.title}>{groupName}</Text>
      {(!members || members.length === 0) && (
        <Text>No members in this group</Text>
      )}
      <FlatList
        data={members}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: "row" }}>
            <Text>
              {item}
              {index < members.length - 1 ? ", " : ""}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal={true}
      />

      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => setExpenseModalVisible(true)}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={expenseModalVisible}
        onRequestClose={() => setExpenseModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.topButtonsContainer}>
              <Pressable
                style={[styles.modalButton2]}
                onPress={cancelCreateExpense}>
                <Text style={[styles.modalButtonText, { color: "#D2042D" }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable style={[styles.modalButton2]} onPress={createExpense}>
                <Text style={[styles.modalButtonText, { color: "#28A745" }]}>
                  Create
                </Text>
              </Pressable>
            </View>
            <TextInput
              placeholder="Title"
              value={expenseTitle}
              onChangeText={setExpenseTitle}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Amount"
              value={expenseAmount}
              onChangeText={setExpenseAmount}
              keyboardType="numeric"
              style={styles.modalInput}
            />

            <Text style={styles.modalText}>Split Between</Text>
            {members.map((member, index) => (
              <Pressable
                key={member}
                style={styles.memberSelect}
                onPress={() => handleSelectMember(member)}>
                <Text>{member}</Text>
                <Ionicons
                  name={
                    selectedMembers.includes(member)
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={24}
                  color="black"
                />
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}
