import React, { useState } from "react";
import { View, Modal, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DropdownMenu = ({ onLogout }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View>
      <Pressable onPress={() => setMenuVisible(true)}>
        <Ionicons name="ellipsis-vertical" size={20} color="black" />
      </Pressable>
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        />
        <View style={styles.dropdownMenu}>
          <Pressable
            onPress={() => {
              onLogout();
              setMenuVisible(false);
            }}>
            <Text style={styles.dropdownItem}>Logout</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};
