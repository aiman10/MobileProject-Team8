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
  FlatList,
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
import { push } from "firebase/database";

export default function ExpenseDetails({ route }) {
  const { memberName, groupId } = route.params;
  const [memberExpenses, setMemberExpenses] = useState([]);
  const navigation = useNavigation();

  const getExpensesFromMemberInGroup = async () => {
    const expensesRef = collection(db, EXPENSES_REF);
    const q = query(expensesRef, where("groupId", "==", groupId));
    const querySnapshot = await getDocs(q);
    const expenses = [];
    querySnapshot.forEach((doc) => {
      expenses.push({ id: doc.id, ...doc.data() });
    });

    // Filter expenses by paidBy and where memberName is included in splitBetween
    const paidByMember = expenses.filter(
      (expense) => expense.paidBy === memberName
    );
    const splitInExpenses = expenses.filter(
      (expense) =>
        expense.splitBetween && expense.splitBetween.includes(memberName)
    );

    // Calculate the total amount paid by the member
    const totalPaid = paidByMember.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );

    // Calculate the total amount the member owes
    const totalOwe = splitInExpenses.reduce((acc, expense) => {
      const numberOfSplits = expense.splitBetween.length;
      const share = expense.amount / numberOfSplits;
      return acc + (expense.paidBy !== memberName ? share : -share);
    }, 0);

    const memberBalance = totalPaid - totalOwe;

    // Update state with the calculated values
    setMemberExpenses({
      totalPaid,
      totalOwe,
      memberBalance,
      expenses: splitInExpenses,
    });
  };

  useEffect(() => {
    getExpensesFromMemberInGroup();
    //console.log(memberName);
  }, [memberName, groupId]);

  const renderItem = ({ item }) => (
    <View style={localStyles.itemContainer}>
      <Text style={localStyles.title}>{item.title}</Text>
      <Text style={localStyles.amount}>{item.amount.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => alert("Remind feature not implemented")}>
        <Text>Remind</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => alert("Settle Up feature not implemented")}>
        <Text>Settle Up</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={localStyles.header}>{memberName}'s Expenses</Text>
      <Text style={localStyles.summary}>
        Total Paid: {memberExpenses.totalPaid}
      </Text>
      <Text style={localStyles.summary}>
        Total Owes: {memberExpenses.totalOwe}
      </Text>
      {/* <Text style={localStyles.summary}>
        Balance: €{memberExpenses.memberBalance}
      </Text> */}
      <FlatList
        data={memberExpenses.expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemContainer: {
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
  },
  amount: {
    fontSize: 16,
    fontWeight: "300",
    marginTop: 5,
  },
  // Add additional styles as needed
});
