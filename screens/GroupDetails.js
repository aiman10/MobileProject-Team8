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
import { Picker } from "@react-native-picker/picker";
import { Categories } from "../constants/Categories.js";
import { set } from "firebase/database";
import { fetchCurrencies } from "../services/Currency.js";
import DateTimePicker from "@react-native-community/datetimepicker";
import { currencySymbols } from "../constants/Currencies.js";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

export default function GroupDetails({ route }) {
  const { groupId } = route.params;
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [groupCurrency, setGroupCurrency] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [uploadImage, setUploadImage] = useState(null);
  const navigation = useNavigation();
  const gotToExpenseDetails = (expenseId) => {
    navigation.navigate("ExpenseDetails", { expenseId: expenseId });
  };

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
      setGroupCurrency(groupSnapshot.data());
      //console.log(groupCurrency.currency);
      setSelectedCurrency(groupSnapshot.data().currency);
    } else {
      //Alert.alert("Group not found");
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
    //delete all expenses TODO test
    const expensesQuery = query(
      collection(db, "expenses"),
      where("groupId", "==", groupId)
    );
    const expensesSnapshot = await getDocs(expensesQuery);
    expensesSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    navigation.navigate("Groups");
  };

  const deleteGroupImage = async (imageUrl) => {
    if (!imageUrl) {
      console.log("No image URL provided for deletion.");
      return;
    }

    const storage = getStorage();
    const imageRef = refFromURL(storage, imageUrl);

    try {
      await deleteObject(imageRef);
      console.log("Group image deleted successfully.");
    } catch (error) {
      console.error("Error deleting group image:", error);
    }
  };

  const fetchExpenses = async () => {
    const expensesQuery = query(
      collection(db, "expenses"),
      where("groupId", "==", groupId)
    );
    const querySnapshot = await getDocs(expensesQuery);
    const expensesData = [];
    querySnapshot.forEach((doc) => {
      expensesData.push({ id: doc.id, ...doc.data() });
    });
    //sort expenses by date
    expensesData.sort((a, b) => b.date.seconds - a.date.seconds);
    setExpenses(expensesData);
  };

  const createExpense = async () => {
    if (!expenseAmount || !expenseTitle) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    let imageUri = null;
    if (uploadImage) {
      imageUri = await uploadImageToStorage(uploadImage, `expenses/${groupId}`);
    }

    const expenseData = {
      amount: parseFloat(expenseAmount),
      title: expenseTitle,
      category: selectedCategory,
      groupId: groupId,
      paidBy: auth.currentUser.uid, // Assuming the current user is paying TODO
      splitBetween: selectedMembers,
      currency: selectedCurrency,
      date: date,
      expenseImage: imageUri,
    };

    try {
      const expenseRef = await addDoc(collection(db, "expenses"), expenseData);
      const groupExpenseData = {
        expenseId: expenseRef.id,
        groupId: groupId,
      };
      await addDoc(collection(db, "group_expenses"), groupExpenseData);
      setExpenseModalVisible(false);
      setExpenseAmount("");
      setExpenseTitle("");
      setSelectedMembers([]);
      setSelectedCategory("");
      fetchExpenses();
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

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setUploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image", error);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access camera was denied");
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setUploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo", error);
    }
  };

  const uploadImageToStorage = async (fileUri, path) => {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const storage = getStorage();
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const cancelCreateExpense = () => {
    setExpenseModalVisible(false);
    setExpenseAmount("");
    setExpenseTitle("");
    setSelectedMembers([]);
    setSelectedCategory("");
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const formatDate = (date) => {
    let d = new Date(date.seconds * 1000);
    let day = ("0" + d.getDate()).slice(-2);
    let month = ("0" + (d.getMonth() + 1)).slice(-2);
    let year = d.getFullYear();
    return `${day}/${month}/${year}`;
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
    fetchCurrencies().then((data) => setCurrencies(data));
    fetchGroupDetails();
    fetchExpenses();
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    setTotalExpenses(total);
  }, [navigation, modalVisible, groupId, expenses]);

  return (
    <View style={[styles.container, { marginTop: -25 }]}>
      <Text style={styles.title}>{groupName}</Text>
      {(!members || members.length === 0) && (
        <Text>No members in this group</Text>
      )}
      <FlatList
        // style={{ marginBottom: -350 }}
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

      <FlatList
        data={expenses}
        renderItem={({ item }) => (
          <Pressable onPress={() => gotToExpenseDetails(item.id)}>
            <View style={styles.expenseItem}>
              <Text style={styles.expenseTitle}>{item.title}</Text>
              <Text style={styles.expenseAmount}>
                {currencySymbols[groupCurrency.currency] || "$"}{" "}
                {item.amount.toFixed(2)}
              </Text>
              <Text style={styles.expenseDate}>{formatDate(item.date)}</Text>
              <Text style={styles.paidByText}>paid by</Text>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.totalExpensesContainer}>
        <Text style={styles.totalExpensesText}>Total Expenses:</Text>
        <Text style={styles.totalExpensesText}>
          {currencySymbols[groupCurrency.currency] || "$"}
          {totalExpenses.toFixed(2)}
        </Text>
      </View>
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
              <Text style={[{ marginTop: 15 }]}>New Expense</Text>
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

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Picker
                selectedValue={selectedCurrency}
                style={{
                  width: "40%",
                  marginBottom: 15,
                }}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedCurrency(itemValue)
                }>
                {currencies.map((currency, index) => (
                  <Picker.Item
                    key={index}
                    label={currency.label}
                    value={currency.value}
                  />
                ))}
              </Picker>
              <TextInput
                placeholder="Amount"
                value={expenseAmount}
                onChangeText={setExpenseAmount}
                keyboardType="numeric"
                style={[styles.modalInput, { width: "55%" }]}
              />
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onDateChange}
              />
            )}

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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 25,
              }}>
              <Text style={[{ flex: 1 }]}>Category:</Text>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedCategory(itemValue)
                }
                style={{ flex: 2, height: 50 }} // Adjust the style as needed
              >
                {Object.entries(Categories).map(([key, value]) => (
                  <Picker.Item key={key} label={value} value={key} />
                ))}
              </Picker>
            </View>
            <Pressable
              onPress={showDatepicker}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  padding: 10,
                  borderRadius: 5,
                },
                styles.buttonDate,
              ]}>
              {({ pressed }) => (
                <Text style={styles.buttonTextDate}>
                  {pressed
                    ? `Selecting Date...`
                    : `${date.toLocaleDateString()}`}
                </Text>
              )}
            </Pressable>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 20,
              }}>
              <Button title="Upload Image" onPress={pickImage} />
              <Button title="Take Photo" onPress={takePhoto} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
