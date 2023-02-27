import React from "react";
import { TouchableOpacity } from "react-native";

// import { moduleName } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { DefaultPostsScreen } from "../Nested/DefaultPostsScreen";
import { CommentsScreen } from "../Nested/CommentsScreen";
import { MapScreen } from "../Nested/MapScreen";

import { Feather } from "@expo/vector-icons";

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
      <NestedScreen.Screen name="Comments" component={CommentsScreen} />
      <NestedScreen.Screen name="Map" component={MapScreen} />
    </NestedScreen.Navigator>
  );
};

// export default PostsScreen;
