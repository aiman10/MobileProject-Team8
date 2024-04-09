import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const ContactListScreen = ({ route, navigation }) => {
  const { contacts } = route.params;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => console.log(`Add ${item.name} to group`)}
      style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
      <Text>{item.name}</Text>
      {item.phoneNumbers && item.phoneNumbers.length > 0 && (
        <Text>{item.phoneNumbers[0].number}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <FlatList
        data={contacts}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ContactListScreen;
