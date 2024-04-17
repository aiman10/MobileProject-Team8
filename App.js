import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Groups from "./screens/Groups";
import GroupDetails from "./screens/GroupDetails";
import FrontPage from "./screens/FrontPage";
import Register from "./screens/Register";
import Login from "./screens/Login";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useState } from "react";
import DropdownMenu from "./components/DropdownMenu";
import { logout, signIn } from "./components/Auth";
import LoadingGIF from "./components/Loading";

const Stack = createStackNavigator();

export default function App({}) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FrontPage">
        <Stack.Screen
          name="FrontPage"
          component={FrontPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Groups"
          component={Groups}
          options={{
            headerLeft: () => null,
            title: "Groups",
          }}
        />

        <Stack.Screen name="GroupDetails" component={GroupDetails} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Loading" component={LoadingGIF} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
