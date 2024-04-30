import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  Alert,
  Button,
  TextInput,
  FlatList,
  Text as RNText,
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
import { Ionicons, FontAwesome } from "@expo/vector-icons";
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
import { all } from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { Svg, Rect, Circle, Text as SvgText, G, Path } from "react-native-svg";

export default function GroupDetails({ route }) {
  const { groupId } = route.params;
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(Categories)[0] || ""
  );
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [groupCurrency, setGroupCurrency] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [uploadImage, setUploadImage] = useState(null);
  const navigation = useNavigation();
  const [selectedPayer, setSelectedPayer] = useState(null);
  const gotToExpenseDetails = (expenseId) => {
    navigation.navigate("ExpenseDetails", {
      expenseId: expenseId,
    });
  };
  const gotToMemberExpenseDetails = (memberName) => {
    navigation.navigate("MemberExpense", {
      memberName: memberName,
      groupId: groupId,
    });
  };
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [activeScreen, setActiveScreen] = useState("expenses");
  const [memberBalances, setMemberBalances] = useState([]);

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
    {
      label: "Leave Group",
      onPress: () => {
        Alert.alert(
          "Leave Group",
          "Are you sure you want to leave this group?",
          [
            {
              text: "Cancel",
              onPress: () => setModalVisible(false),
            },
            {
              text: "Leave",
              onPress: () => {
                // leaveGroup(); // TODO
              },
            },
          ]
        );
      },
    },
  ];

  const maxAbsBalance = Math.max(
    ...memberBalances.map((member) => Math.abs(member.balance))
  );

  const fetchGroupDetails = async () => {
    const groupRef = doc(db, GROUPS_REF, groupId);
    const groupSnapshot = await getDoc(groupRef);
    if (groupSnapshot.exists()) {
      setGroupName(groupSnapshot.data().name);
      setMembers(groupSnapshot.data().members);
      setGroupCurrency(groupSnapshot.data());
      //console.log(groupSnapshot.data());
      calculateMemberBalances();
      setSelectedCurrency(groupSnapshot.data().currency);
    } else {
      //Alert.alert("Group not found");
    }
  };

  const getExpensesByGroup = async () => {
    const expensesQuery = query(
      collection(db, "expenses"),
      where("groupId", "==", groupId)
    );
    const querySnapshot = await getDocs(expensesQuery);
    const expensesData = [];
    querySnapshot.forEach((doc) => {
      expensesData.push({ id: doc.id, ...doc.data() });
    });

    //filter expensedata only retreive paidby, amount, splitbetween
    expensesData.map((expense) => {
      const { paidBy, amount, splitBetween } = expense;
      return { paidBy, amount, splitBetween };
    });
    //console.log("ExpensesData:", expensesData);
    return expensesData;
  };

  const calculateMemberBalances = async () => {
    const expenses = await getExpensesByGroup();
    const memberBalances = {};
    expenses.forEach((expense, index) => {
      const { paidBy, amount, splitBetween } = expense;

      if (!memberBalances[paidBy]) {
        memberBalances[paidBy] = 0;
      }
      const numberOfSplits = splitBetween.includes(paidBy)
        ? splitBetween.length
        : splitBetween.length + 1;

      const splitAmount = amount / numberOfSplits;
      memberBalances[paidBy] += splitAmount;
      splitBetween.forEach((member) => {
        if (!memberBalances[member]) {
          memberBalances[member] = 0;
        }

        if (member !== paidBy) {
          memberBalances[member] -= splitAmount;
        }
      });
    });

    const membersWithBalances = Object.entries(memberBalances).map(
      ([name, balance]) => ({ name, balance })
    );

    // console.log("****************************");
    // membersWithBalances.forEach((member, index) => {
    //   console.log(
    //     `Name: ${member.name}, Balance: ${member.balance.toFixed(2)}`
    //   );
    // });
    //return membersWithBalances;
    setMemberBalances(membersWithBalances);
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

  const leaveGroup = async (groupId) => {
    try {
      const q = query(
        collection(db, USER_GROUPS_REF),
        where("userId", "==", auth.currentUser.uid),
        where("groupId", "==", groupId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      Alert.alert("You have left the group.");
      fetchUserGroups();
    } catch (error) {
      console.error("Error leaving group:", error);
      Alert.alert("Failed to leave the group.");
    }
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
    setAllExpenses(expensesData);
    calculateMemberBalances();
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

    const expenseCategory = selectedCategory || Object.keys(Categories)[0];

    const expenseData = {
      amount: parseFloat(expenseAmount),
      title: expenseTitle,
      category: expenseCategory,
      groupId: groupId,
      paidBy: selectedPayer, // Assuming the current user is paying TODO
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
      setSelectedPayer("");
      calculateMemberBalances();
    } catch (error) {
      console.error("Error adding expense", error);
      Alert.alert("Error", "There was an issue adding the expense.");
    }
  };

  const handleSelectMember = (member) => {
    if (member === selectedPayer) {
      return; // Prevent adding the payer to the split list
    }
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
    setSelectedPayer("");
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

  const filterExpensesByCategory = (category) => {
    if (category === "All") {
      setExpenses(allExpenses);
      return;
    } else {
      //console.log("Stap 2: Expenses:", allExpenses);
      const filteredExpenses = allExpenses.filter(
        (expense) => expense.category.toLowerCase() === category.toLowerCase()
      );
      setExpenses(filteredExpenses);
      //console.log("Stap 3: Filtered Expenses:", filteredExpenses);
      //console.log("Filtered Expenses:", filteredExpenses);
    }
  };

  const MemberBalanceGraph = ({ membersWithBalances, maxAbsBalance }) => {
    // Constants for padding and graph dimensions
    const svgPadding = 20; // Padding value can be adjusted as needed
    const svgHeight = 200 + svgPadding * 2; // Increased SVG height to accommodate text
    const svgWidth = 300; // SVG width
    const barWidth = svgWidth / membersWithBalances.length; // Width of each bar
    const chartCenter = svgHeight / 2; // Center line of the chart
    const minBarHeight = 15; // Minimum height of the bar to determine spacing

    return (
      <Svg height={svgHeight} width={svgWidth}>
        {membersWithBalances.map((member, index) => {
          const barHeight =
            (Math.abs(member.balance) / maxAbsBalance) *
            (chartCenter - svgPadding);
          const barX = barWidth * index;
          const barY =
            member.balance >= 0 ? chartCenter - barHeight : chartCenter;
          const fillColor = member.balance >= 0 ? "#9ED6A5" : "#FFA593";
          // Calculate if additional space is needed for the name based on the bar height
          const additionalSpace = barHeight < minBarHeight ? 10 : 0;

          // Adjusted textY for balance inside the bar
          const textYInsideBar =
            member.balance >= 0
              ? barY + barHeight - 10 // For positive balance, near the bottom of the green bar
              : barY + 20; // For negative balance, near the top of the red bar

          // Keep the name position calculation as is and add additionalSpace if needed
          const nameY =
            member.balance >= 0
              ? chartCenter - barHeight - 9 - additionalSpace // Move the name up if the bar is small
              : chartCenter + barHeight + 15 + additionalSpace; // Move the name down if the bar is small
          const handlePress = () => {
            gotToMemberExpenseDetails(member.name);
          };
          return (
            <React.Fragment key={member.name}>
              <Rect
                x={barX + 5}
                y={barY}
                width={barWidth - 10}
                height={Math.max(barHeight, minBarHeight)} // Ensure the bar is not too small
                fill={fillColor}
                onPress={handlePress}
              />
              <SvgText
                x={barX + barWidth / 2}
                y={textYInsideBar} // Adjusted for inside the bar
                fontSize="13"
                fill="black" // White text for better visibility inside the bar
                textAnchor="middle"
                onPress={handlePress}>
                {`${member.balance.toFixed(0)} ${
                  currencySymbols[groupCurrency.currency] || "$"
                }`}
              </SvgText>
              <SvgText
                x={barX + barWidth / 2}
                y={nameY} // Name position above or below the bar, with dynamic spacing
                fontSize="13"
                fill="black"
                textAnchor="middle"
                onPress={handlePress}>
                {member.name}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeSector = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M",
      x,
      y,
      "L",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  };

  const CategorySpendingGraph = ({ expenses }) => {
    const [categoryTotals, setCategoryTotals] = useState({});

    useEffect(() => {
      const totals = expenses.reduce((acc, curr) => {
        const { category, amount } = curr;
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {});
      setCategoryTotals(totals);
    }, [expenses]);

    const totalSpent = Object.values(categoryTotals).reduce(
      (acc, curr) => acc + curr,
      0
    );
    const categories = Object.keys(categoryTotals);
    let startAngle = 0;
    const colors = [
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
    ];

    return (
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
        <Svg height="200" width="200" viewBox="0 0 200 200">
          {categories.map((category, index) => {
            const sliceAmount = categoryTotals[category];
            const sliceAngle = (sliceAmount / totalSpent) * 360;
            const endAngle = startAngle + sliceAngle;
            const path = describeSector(100, 100, 80, startAngle, endAngle);
            const middleAngle = startAngle + sliceAngle / 2;
            const { x, y } = polarToCartesian(100, 100, 60, middleAngle);
            const percentage =
              ((sliceAmount / totalSpent) * 100).toFixed(1) + "%";
            startAngle = endAngle;

            return (
              <React.Fragment key={index}>
                <Path d={path} fill={colors[index % colors.length]} />
                <SvgText
                  x={x}
                  y={y}
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle">
                  {percentage}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
        <View style={{ paddingLeft: 10 }}>
          {categories.map((category, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 2,
              }}>
              <View
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: colors[index % colors.length],
                  marginRight: 5,
                }}
              />
              <RNText>{category}</RNText>
            </View>
          ))}
        </View>
      </View>
    );
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
  }, [navigation, modalVisible, groupId]);

  useEffect(() => {
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    setTotalExpenses(total);
  }, [expenses]);

  useFocusEffect(
    React.useCallback(() => {
      // Fetch expenses whenever the screen is focused and possibly after coming back from ExpenseDetails
      fetchExpenses();
    }, [])
  );

  return (
    <View style={[styles.container, { marginTop: -25 }]}>
      <RNText style={styles.title}>{groupName}</RNText>
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeScreen === "expenses" && styles.activeTab]}
          onPress={() => setActiveScreen("expenses")}>
          <RNText style={styles.tabText}>Expenses</RNText>
        </Pressable>
        <Pressable
          style={[styles.tab, activeScreen === "members" && styles.activeTab]}
          onPress={() => setActiveScreen("members")}>
          <RNText style={styles.tabText}>Members</RNText>
        </Pressable>
      </View>

      {activeScreen === "expenses" ? (
        <>
          {expenses.length <= 0 ? (
            <>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setCategoryModalVisible(true)}>
                <FontAwesome name="filter" size={24} color="black" />
              </TouchableOpacity>
              <RNText style={styles.expensesTitle}>
                There are no expenses
              </RNText>
            </>
          ) : (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setCategoryModalVisible(true)}>
              <FontAwesome name="filter" size={24} color="black" />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <FlatList
              data={expenses}
              renderItem={({ item }) => (
                <Pressable onPress={() => gotToExpenseDetails(item.id)}>
                  <View style={styles.expenseItem}>
                    <RNText style={styles.expenseTitle}>{item.title}</RNText>
                    <RNText style={styles.expenseAmount}>
                      {currencySymbols[groupCurrency.currency] || "$"}{" "}
                      {item.amount.toFixed(2)}
                    </RNText>
                    <RNText style={styles.expenseDate}>
                      {formatDate(item.date)}
                    </RNText>
                    <RNText style={styles.paidByText}>
                      paid by {item.paidBy.substring(0, 10)}
                    </RNText>
                  </View>
                </Pressable>
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={true}
            />
          </View>
        </>
      ) : (
        <>
          <ScrollView>
            <View style={[styles.expenseMembersPage]}>
              <RNText
                style={[
                  styles.sectionTitle,
                  { textAlign: "center", marginTop: -20 },
                ]}>
                Member Balances
              </RNText>
              <MemberBalanceGraph
                membersWithBalances={memberBalances}
                maxAbsBalance={maxAbsBalance}
              />
            </View>

            <View
              style={{ marginTop: -250, marginLeft: -20, marginBottom: 20 }}>
              <RNText
                style={[
                  styles.sectionTitle,
                  { textAlign: "center", marginTop: 10 },
                ]}>
                Category Spending
              </RNText>
              <CategorySpendingGraph expenses={expenses} />
            </View>
          </ScrollView>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}>
        <View style={[styles.centeredView2]}>
          <View style={[styles.modalView]}>
            <ScrollView>
              <TouchableOpacity
                style={styles.filterModalButton}
                onPress={() => {
                  filterExpensesByCategory("All");
                  setCategoryModalVisible(false);
                }}>
                <RNText style={styles.textStyle}>All</RNText>
              </TouchableOpacity>

              {Object.entries(Categories).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={styles.filterModalButton}
                  onPress={() => {
                    filterExpensesByCategory(key);
                    setCategoryModalVisible(false);
                  }}>
                  <RNText style={styles.textStyle}>{value}</RNText>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.closeModalButton]}
              onPress={() => setCategoryModalVisible(false)}>
              <RNText style={styles.textStyle}>Close</RNText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.totalExpensesContainer}>
        <RNText style={styles.totalExpensesText}>Total Expenses:</RNText>
        <RNText style={styles.totalExpensesText}>
          {currencySymbols[groupCurrency.currency] || "$"}
          {totalExpenses.toFixed(2)}
        </RNText>
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
            <ScrollView>
              <View style={styles.topButtonsContainer}>
                <Pressable
                  style={[styles.modalButton2]}
                  onPress={cancelCreateExpense}>
                  <RNText
                    style={[styles.modalButtonText, { color: "#D2042D" }]}>
                    Cancel
                  </RNText>
                </Pressable>
                <RNText style={[{ marginTop: 15 }]}>New Expense</RNText>
                <Pressable
                  style={[styles.modalButton2]}
                  onPress={createExpense}>
                  <RNText
                    style={[styles.modalButtonText, { color: "#28A745" }]}>
                    Create
                  </RNText>
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
              <RNText style={styles.modalText}>Paid By</RNText>
              {members.map((member, index) => (
                <Pressable
                  key={member}
                  style={[
                    styles.memberSelect,
                    selectedPayer === member && styles.selectedMember, // Add a style for the selected state
                  ]}
                  onPress={() => setSelectedPayer(member)}>
                  <RNText>{member}</RNText>
                  <Ionicons
                    name={
                      selectedPayer === member
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={24}
                    color={selectedPayer === member ? "#28A745" : "grey"} // Change color based on selection
                  />
                </Pressable>
              ))}
              <RNText style={styles.modalText}>Split Between</RNText>
              {members
                .filter((member) => member !== selectedPayer)
                .map((member, index) => (
                  <Pressable
                    key={member}
                    style={styles.memberSelect}
                    onPress={() => handleSelectMember(member)}>
                    <RNText>{member}</RNText>
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
                <RNText style={[{ flex: 1 }]}>Category:</RNText>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedCategory(itemValue)
                  }
                  style={styles.categoryPickerStyle} // Adjust the style as needed
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
                  <RNText style={styles.buttonTextDate}>
                    {pressed
                      ? `Selecting Date...`
                      : `${date.toLocaleDateString()}`}
                  </RNText>
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
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
