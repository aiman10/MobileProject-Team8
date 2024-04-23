import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import styles from "../style/styles.js";
import { db } from "../firebase/Config";
import { doc, getDoc } from "firebase/firestore";

export default function ExpenseDetails({ route }) {
  const { expenseId } = route.params;
  const [expenseDetails, setExpenseDetails] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchExpenseDetails = async () => {
      const expenseRef = doc(db, "expenses", expenseId);
      const expenseSnap = await getDoc(expenseRef);
      if (expenseSnap.exists()) {
        setExpenseDetails(expenseSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchExpenseDetails();
  }, [expenseId]);

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
