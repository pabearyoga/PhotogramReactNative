import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

// export const CreatePostsScreen = ({ navigation: { goBack } }) => {
export const CreatePostsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>CreatePostsScreen</Text>
      {/* <View>
        <Button onPress={() => goBack()} title="Go Back" />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
