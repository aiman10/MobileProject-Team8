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
import GroupDetails from "./GroupDetails.js";
import { useNavigation } from "@react-navigation/native";
import { logout, signIn } from "../components/Auth";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Groups({ naviagate }) {
  const [groupName, setGroupName] = useState("");
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const goToGroupDetails = (groupId) => {
    navigation.navigate("GroupDetails", { groupId: groupId });
  };
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserGroups();
  }, []);

  const fetchUserGroups = async () => {
    //setIsLoading(true);
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
        console.error("Group not found");
        return null;
      }
    });

    const groups = (await Promise.all(groupFetchPromises)).filter(Boolean);
    setUserGroups(groups);
    setIsLoading(false);
  };

  const createGroup = async () => {
    try {
      const groupRef = await addDoc(collection(db, GROUPS_REF), {
        name: groupName,
      });

      await addDoc(collection(db, USER_GROUPS_REF), {
        userId: auth.currentUser.uid,
        groupId: groupRef,
      });

      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

      //Alert.alert("Group created successfully");

      fetchUserGroups();
      setGroupName("");
      setIsModalVisible(false);
    } catch (error) {
      // Alert.alert("Error creating group");
      console.error("Error creating group", error);
    }
  };

  //temporary logout function
  const handlePressLogout = () => {
    logout();
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Groups</Text>
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
              <Text>{item.name}</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="#000"
                style={styles.iconStyle}
              />
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.infoText}>No Groups yet</Text>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.groupButtonStyle}
        onPress={() => setIsModalVisible(true)}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign name="addusergroup" size={24} color="white" />
          <Text style={styles.groupButtonText}>Add new group</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Create a new group</Text>
            <TextInput
              placeholder="Group Name"
              value={groupName}
              onChangeText={setGroupName}
              style={styles.modalInput}
            />
            <Button title="Create Group" onPress={createGroup} />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <Pressable style={styles.button} onPress={handlePressLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}
