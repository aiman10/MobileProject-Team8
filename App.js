import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Groups from "./screens/Groups";
import GroupDetails from "./screens/GroupDetails";
import FrontPage from "./screens/FrontPage";
import Register from "./screens/Register";
import Login from "./screens/Login";
import { logout } from "./components/Auth";
import DropdownMenu from "./components/DropdownMenu";
const Stack = createStackNavigator();

export default function App() {
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
          options={({ route }) => ({
            headerLeft: () => {
              const isLoggedIn = route.params?.isLoggedIn;
              return isLoggedIn ? null : <></>;
            },
            // headerRight: () => (
            //   <DropdownMenu
            //     onLogout={() => {
            //       logout();
            //       navigation.replace("Login");
            //     }}
            //   />
            // ),
          })}
        />
        <Stack.Screen name="GroupDetails" component={GroupDetails} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
