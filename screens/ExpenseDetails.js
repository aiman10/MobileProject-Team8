import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  Button,
  TextInput,
  FlatList,
  Image,
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
import { Picker } from "@react-native-picker/picker";
import { Categories } from "../constants/Categories.js";
import { set } from "firebase/database";
import { fetchCurrencies } from "../services/Currency.js";
import DateTimePicker from "@react-native-community/datetimepicker";
import { currencySymbols } from "../constants/Currencies.js";
import { all } from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

export default function ExpenseDetails({ route }) {
  const { expenseId } = route.params;
  const [expenseDetails, setExpenseDetails] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  const fetchExpenseDetails = async () => {
    const expenseRef = doc(db, "expenses", expenseId);
    const expenseSnap = await getDoc(expenseRef);
    if (expenseSnap.exists()) {
      //console.log("Document data:", expenseSnap.data());
      setExpenseDetails(expenseSnap.data());
    } else {
      console.log("No such document!");
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
      <Image
        source={{ uri: expenseDetails.expenseImage }}
        style={{ width: 300, height: 300 }}
      />
    </View>
  );
}
