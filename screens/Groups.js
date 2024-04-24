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
} from "firebase/firestore";
import {
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { logout, signIn } from "../components/Auth";
import * as Contacts from "expo-contacts";
import DropdownMenu from "../components/DropdownMenu.js";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { fetchCurrencies } from "../services/Currency.js";
import { set } from "firebase/database";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Groups({}) {
  const [groupName, setGroupName] = useState("");
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const goToGroupDetails = (groupId) => {
    navigation.navigate("Expenses", { groupId: groupId });
  };
  const navigation = useNavigation();
  const [memberUsernames, setMemberUsernames] = useState([]);
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isContactListModalVisible, setIsContactListModalVisible] =
    useState(false);
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currency, setCurrency] = useState("EUR");
  const [currencies, setCurrencies] = useState([]);
  const [uploadImage, setUploadImage] = useState(null);

  const menuOptions = [
    {
      label: "Logout",
      onPress: () => handlePressLogout(),
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      fetchUserGroups();
    }, [])
  );

  useEffect(
    () => {
      getCurrentUserName();
      fetchUserGroups();
      fetchCurrencies().then((data) => setCurrencies(data));
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

      (async () => {
        if (Platform.OS !== "web") {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
          }
        }
      })();
    },
    [navigation, modalVisible],
    uploadImage
  );

  const fetchUserGroups = async () => {
    //setIsLoading(true);
    try {
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
          return null;
        }
      });

      let groups = (await Promise.all(groupFetchPromises)).filter(Boolean);
      groups = groups.sort((a, b) => a.id.localeCompare(b.id));
      setUserGroups(groups);
      setIsLoading(false);
    } catch (error) {
      return null;
    }
  };

  const getCurrentUserName = async () => {
    try {
      const userRef = doc(db, USERS_REF, auth.currentUser.uid);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        //console.log(userSnapshot.data().username);
        return userSnapshot.data().username;
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  const createGroup = async () => {
    if (groupName.trim() === "") {
      Alert.alert("Please enter a group name");
      return;
    } else {
      try {
        const currentUserName = await getCurrentUserName();

        if (!currentUserName) {
          console.error("Error fetching current user");
        }

        let imageUrl = null;
        if (uploadImage) {
          imageUrl = await uploadImageToStorage(
            uploadImage,
            `groupImages/${new Date().getTime()}`
          );
        }
        //console.log("Image URL", imageUrl);
        const groupRef = await addDoc(collection(db, GROUPS_REF), {
          name: groupName,
          members: [currentUserName, ...memberUsernames],
          description: groupDescription,
          currency: currency,
          groupImage: imageUrl,
        });
        await addDoc(collection(db, USER_GROUPS_REF), {
          userId: auth.currentUser.uid,
          groupId: groupRef,
        });

        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

        setIsModalVisible(false);
        fetchUserGroups();
        setMemberUsernames([]);
        setGroupName("");
        setGroupDescription("");
        setCurrency("EUR");
        setUploadImage(null);
      } catch (error) {
        console.error("Error creating group", error);
      }
    }
  };

  const addMember = () => {
    if (newMemberUsername.trim() !== "") {
      setMemberUsernames([...memberUsernames, newMemberUsername.trim()]);
      setNewMemberUsername("");
    }
  };

  const removeMember = (index) => {
    setMemberUsernames((prev) => {
      const newMembers = [...prev];
      newMembers.splice(index, 1);
      return newMembers;
    });
  };

  const loadContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          setContacts(data);
          setIsContactListModalVisible(true);
          setIsModalVisible(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectContact = (contact) => {
    if (contact.name) {
      setMemberUsernames([...memberUsernames, contact.name]);
    }
    setIsContactListModalVisible(false);
    setIsModalVisible(true);
  };

  const handlePressLogout = () => {
    logout();
    navigation.navigate("FrontPage");
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [26, 10],
        quality: 1,
      });

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        setUploadImage(result.assets[0].uri);
        //console.log("Picked image URI:", result.assets[0].uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [26, 10],
        quality: 1,
      });

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        setUploadImage(result.assets[0].uri);
        //console.log("Photo URI:", result.assets[0].uri);
      }
    } catch (e) {
      console.error("Error taking photo:", e);
    }
  };

  const uploadImageToStorage = async (fileUri, path) => {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const storage = getStorage();
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  };

  const cancelCreateGroup = () => {
    setIsModalVisible(false);
    setMemberUsernames([]);
    setUploadImage(null);
    setGroupName("");
    setGroupDescription("");
    setCurrency("EUR");
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={userGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
                },
                styles.card,
              ]}
              onPress={() => goToGroupDetails(item.id)}>
              <View style={{ alignItems: "flex-start" }}>
                <Text style={styles.groupText}>{item.name}</Text>
                {item.groupImage && (
                  <Image
                    source={{ uri: item.groupImage }}
                    style={{ width: 260, height: 100, marginTop: 10 }}
                    //resizeMode="contain"
                  />
                )}
              </View>
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.infoText}>No Groups yet</Text>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => setIsModalVisible(true)}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.topButtonsContainer}>
              <Pressable
                style={[styles.modalButton2]}
                onPress={cancelCreateGroup}>
                <Text style={[styles.modalButtonText, { color: "#D2042D" }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable style={[styles.modalButton2]} onPress={createGroup}>
                <Text style={[styles.modalButtonText, { color: "#28A745" }]}>
                  Create
                </Text>
              </Pressable>
            </View>

            <Text style={styles.modalText}>New Group</Text>
            <TextInput
              placeholder="Group Name"
              value={groupName}
              onChangeText={setGroupName}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Description"
              value={groupDescription}
              onChangeText={setGroupDescription}
              style={styles.modalInput}
            />
            <Text style={[styles.modalText, { marginTop: 15 }]}>Members</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <TextInput
                placeholder="Add Member"
                value={newMemberUsername}
                onChangeText={setNewMemberUsername}
                style={[styles.modalInput, { flex: 1, marginRight: 10 }]}
              />
              <Pressable
                style={[styles.modalButton3, { paddingHorizontal: 15 }]}
                onPress={addMember}>
                <Text style={styles.modalButtonText}>Add</Text>
              </Pressable>
            </View>

            {memberUsernames.map((username, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 5,
                }}>
                <Text style={{ marginRight: 10 }}>{username}</Text>
                <Pressable onPress={() => removeMember(index)}>
                  <Ionicons name="close-circle" size={24} color="red" />
                </Pressable>
              </View>
            ))}

            <Pressable
              style={[styles.modalButton, { alignSelf: "center" }]}
              onPress={loadContacts}>
              <Text style={styles.modalButtonText}>Import Contacts</Text>
            </Pressable>

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "black",
                marginTop: 50,
              }}>
              <Picker
                selectedValue={currency}
                style={{
                  height: 50,
                  width: "100%",
                }}
                onValueChange={(itemValue, itemIndex) =>
                  setCurrency(itemValue)
                }>
                {currencies.map((currency, index) => (
                  <Picker.Item
                    key={index}
                    label={currency.label}
                    value={currency.value}
                  />
                ))}
              </Picker>
            </View>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isContactListModalVisible}
        onRequestClose={() => setIsContactListModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={contacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => selectContact(item)}
                  style={styles.contactItem}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                    <Text style={styles.contactNumber}>
                      {item.phoneNumbers[0].number}
                    </Text>
                  )}
                </Pressable>
              )}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setIsContactListModalVisible(false);
                setIsModalVisible(true);
              }}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
