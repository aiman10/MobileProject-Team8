import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";

import styles from "../style/styles.js";
import { EXPENSES_REF, GROUP_EXPENSES_REF, db } from "../firebase/Config";
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import DropdownMenu from "../components/DropdownMenu.js";
import { Ionicons } from "@expo/vector-icons";

export default function ExpenseDetails({ route }) {
  const { expenseId } = route.params;
  const [expenseDetails, setExpenseDetails] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigation = useNavigation();

  const menuOptions = [
    {
      label: "Delete Expense",
      onPress: () => {
        Alert.alert(
          "Delete Expense",
          "Are you sure you want to delete this expense?",
          [
            {
              text: "Cancel",
              onPress: () => setDeleteModalVisible(false),
            },
            {
              text: "Delete",
              onPress: () => {
                deleteExpense();
              },
            },
          ]
        );
      },
    },
  ];

  const fetchExpenseDetails = async () => {
    const expenseRef = doc(db, "expenses", expenseId);
    const expenseSnap = await getDoc(expenseRef);
    if (expenseSnap.exists()) {
      setExpenseDetails(expenseSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <Pressable onPress={() => setDeleteModalVisible(true)}>
            <Ionicons
              name="settings"
              size={24}
              color="black"
              style={{ marginRight: 15 }}
            />
          </Pressable>
          <DropdownMenu
            isVisible={deleteModalVisible}
            menuOptions={menuOptions}
            onClose={() => setDeleteModalVisible(false)}
          />
        </>
      ),
    });

    fetchExpenseDetails();
  }, [expenseId, navigation, deleteModalVisible]);

  const deleteExpense = async () => {
    const expenseRef = doc(db, "expenses", expenseId);
    try {
      await deleteDoc(expenseRef);
      navigation.goBack();
      route.params.onExpenseDeleted?.();
    } catch (error) {
      console.error("Error deleting document: ", error);
      Alert.alert("Error", "There was a problem deleting the expense.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{expenseDetails.title}</Text>
      <Text style={styles.text}>
        Amount: {expenseDetails.amount} {expenseDetails.currency}
      </Text>
      <Text style={styles.text}>Category: {expenseDetails.category}</Text>
      <Text style={styles.text}>Description: {expenseDetails.description}</Text>

      {
        //show button only if there is an image
        expenseDetails.expenseImage && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>View Receipt</Text>
          </TouchableOpacity>
        )
      }

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <Image
            source={{ uri: expenseDetails.expenseImage }}
            style={styles.fullSizeImage}
          />
          <TouchableOpacity
            style={[styles.buttonClose, { marginTop: -75 }]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={[styles.textStyle]}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
