import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

const DropdownMenu = ({ isVisible, onClose, menuOptions }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          {menuOptions.map((option, index) => (
            <Pressable key={index} onPress={option.onPress}>
              <Text style={styles.menuItem}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

export default DropdownMenu;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
  modalContent: {
    marginTop: 45,
    marginRight: 10,
    width: 150,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  menuItem: {
    marginVertical: 10,
  },
});
