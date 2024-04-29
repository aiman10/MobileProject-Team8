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
  const { memberName, groupId } = route.params;
  const navigation = useNavigation();
  useEffect(() => {
    console.log(memberName);
    console.log(groupId);
  });
}
