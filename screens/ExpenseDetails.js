import React, { useEffect, useState, useCallback } from "react";
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
      <View style={localStyles.headerContainer}>
        <Text style={localStyles.expenseTitle}>{expenseDetails.title}</Text>
        <Text style={localStyles.expenseAmount}>
          € {expenseDetails.amount?.toFixed(2)}
        </Text>
        <Text style={localStyles.paidByText}>
          Paid by {expenseDetails.paidBy}
        </Text>
        <Text style={localStyles.expenseDate}>
          {new Date(expenseDetails.date?.seconds * 1000).toLocaleDateString()}
        </Text>

        {
          //show button only if there is an image
          expenseDetails.expenseImage && (
            <TouchableOpacity
              style={[styles.button, { marginLeft: 0 }]}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>View Receipt</Text>
            </TouchableOpacity>
          )
        }
      </View>

      <Text style={localStyles.participantHeader}>
        For {expenseDetails.splitBetween?.length} participants, including me
      </Text>

      <View style={localStyles.participantList}>
        {expenseDetails.splitBetween?.map((participant) => (
          <View style={localStyles.participantItem} key={participant}>
            <Text style={localStyles.participantName}>
              {participant}{" "}
              {participant === expenseDetails.paidBy ? "(me)" : ""}
            </Text>
            <Text style={localStyles.participantAmount}>
              €{" "}
              {(
                expenseDetails.amount / expenseDetails.splitBetween.length
              ).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

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

const localStyles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#E5E5E5",
    width: "100%",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  expenseTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  expenseAmount: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginVertical: 5,
  },
  paidByText: {
    fontSize: 16,
    color: "#555",
  },
  expenseDate: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 10,
  },
  participantHeader: {
    padding: 20,
    fontSize: 16,
  },
  participantList: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    width: "100%",
  },
  participantItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  participantName: {
    fontSize: 16,
  },
  participantAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  // ... more styles as needed
});
