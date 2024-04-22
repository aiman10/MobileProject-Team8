import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Groups from "./screens/Groups";
import GroupDetails from "./screens/GroupDetails";
import FrontPage from "./screens/FrontPage";
import Register from "./screens/Register";
import Login from "./screens/Login";
import ExpenseDetails from "./screens/ExpenseDetails.js";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useState } from "react";
import DropdownMenu from "./components/DropdownMenu";
import { logout, signIn } from "./components/Auth";
import LoadingGIF from "./components/Loading";
import styles from "./style/styles.js";
const Stack = createStackNavigator();

export default function App({}) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FrontPage">
        <Stack.Screen
          name="FrontPage"
          component={FrontPage}
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: "#46467A",
            },
          }}
        />
        <Stack.Screen
          name="Groups"
          component={Groups}
          options={{
            headerLeft: () => null,
            title: "Groups",
            headerStyle: {
              backgroundColor: "#46467A",
            },
          }}
        />

        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: "#46467A",
            },
          }}
          name="GroupDetails"
          component={GroupDetails}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: "#46467A",
            },
          }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: "#46467A",
            },
          }}
          name="Register"
          component={Register}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: "#FFC212",
            },
          }}
          name="Loading"
          component={LoadingGIF}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: "#46467A",
            },
          }}
          name="ExpenseDetails"
          component={ExpenseDetails}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
