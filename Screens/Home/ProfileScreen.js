import React from "react";
import { TouchableOpacity } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { DefaultProfileScreen } from "../Nested/DefaultProfileScreen";
import { CommentsScreen } from "../Nested/CommentsScreen";
import { MapScreen } from "../Nested/MapScreen";

import { Fontisto, Feather, AntDesign } from "@expo/vector-icons";

const NestedScreen = createStackNavigator();

export const ProfileScreen = () => {
  return (
    <NestedScreen.Navigator
      screenOptions={{
        headerStyle: {
          borderBottomWidth: 1,
        },
      }}
    >
      <NestedScreen.Screen
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
        component={DefaultProfileScreen}
      />
      <NestedScreen.Screen
        options={({ navigation: { goBack } }) => ({
          tabBarIcon: ({ focused, size, color }) => (
            <Fontisto name="plus-a" size={18} color={color} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
              onPress={() => goBack()}
            >
              <AntDesign
                name="arrowleft"
                size={24}
                color={"rgba(33, 33, 33, 0.8)"}
              />
            </TouchableOpacity>
          ),
          tabBarStyle: {
            display: "none",
          },
        })}
        name="Comments"
        component={CommentsScreen}
      />
      <NestedScreen.Screen
        options={({ navigation: { goBack } }) => ({
          tabBarIcon: ({ focused, size, color }) => (
            <Fontisto name="plus-a" size={18} color={color} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
              onPress={() => goBack()}
            >
              <AntDesign
                name="arrowleft"
                size={24}
                color={"rgba(33, 33, 33, 0.8)"}
              />
            </TouchableOpacity>
          ),
          tabBarStyle: {
            display: "none",
          },
        })}
        name="Map"
        component={MapScreen}
      />
    </NestedScreen.Navigator>
  );
};
