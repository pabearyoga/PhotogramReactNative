import { Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from "./Screens/Auth/LoginScreen";
import RegistrationScreen from "./Screens/Auth/RegistrationScreen";
import { PostsScreen } from "./Screens/Home/PostsScreen";
import { CreatePostsScreen } from "./Screens/Home/CreatePostsScreen";
import { ProfileScreen } from "./Screens/Home/ProfileScreen";

import { SimpleLineIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <AuthStack.Screen
          name="RegistrationScreen"
          component={RegistrationScreen}
        />
        <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      </AuthStack.Navigator>
    );
  }
  // console.log(navigation);
  return (
    <MainTab.Navigator
      backBehavior={"history"}
      screenOptions={{
        headerStyle: {
          borderBottomWidth: 1,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#fff",
        tabBarActiveBackgroundColor: "#FF6C00",
        tabBarStyle: {
          paddingHorizontal: 80,
          borderTopWidth: 1,
        },
        tabBarItemStyle: {
          borderRadius: 100,
          borderWidth: 1,
          marginTop: 9,
          borderColor: "transparent",
        },
      }}
    >
      <MainTab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <SimpleLineIcons name="grid" size={18} color={color} />
          ),

          headerRight: () => (
            <Button
              onPress={() => alert("This is a button!")}
              title="Logout"
              color="red"
            />
          ),
        }}
        name="Публикации"
        component={PostsScreen}
      />
      <MainTab.Screen
        options={({ navigation: { goBack } }) => ({
          tabBarIcon: ({ focused, size, color }) => (
            <Fontisto name="plus-a" size={18} color={color} />
          ),
          headerLeft: () => (
            <Button onPress={() => goBack()} title="Back" color="red" />
          ),
          tabBarStyle: {
            display: "none",
          },
        })}
        name="Создать публикацию"
        component={CreatePostsScreen}
      />
      <MainTab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Feather name="user" size={18} color={color} />
          ),
          headerRight: () => (
            <Button
              onPress={() => alert("This is a button!")}
              title="Logout"
              color="red"
            />
          ),
        }}
        name="Профиль"
        component={ProfileScreen}
      />
    </MainTab.Navigator>
  );
};
