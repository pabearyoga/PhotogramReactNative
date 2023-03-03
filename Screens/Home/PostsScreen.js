import React from "react";
import { TouchableOpacity } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { DefaultPostsScreen } from "../Nested/DefaultPostsScreen";
import { CommentsScreen } from "../Nested/CommentsScreen";
import { MapScreen } from "../Nested/MapScreen";

import { Fontisto, Feather, AntDesign } from "@expo/vector-icons";

const NestedScreen = createStackNavigator();

export const PostsScreen = () => {
  return (
    <NestedScreen.Navigator
      screenOptions={{
        headerStyle: {
          borderBottomWidth: 1,
        },
      }}
    >
      <NestedScreen.Screen
        name="Публикации"
        component={DefaultPostsScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() => console.log("logout")}
            >
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        }}
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
