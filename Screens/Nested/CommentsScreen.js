import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Keyboard,
} from "react-native";

import moment from "moment";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { Ionicons } from "@expo/vector-icons";

import { db } from "../../firebase/config";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

export const CommentsScreen = ({ route }) => {
  const postId = route.params.item.id;
  const image = route.params.item.image;

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const { userAvatar } = useSelector((stateRedux) => stateRedux.auth);

  useEffect(() => {
    getAllPosts();
  }, []);
  console.log(comment);

  const createPost = async () => {
    const commentsRef = collection(db, "posts", postId, "comments");
    await addDoc(commentsRef, {
      comment: comment.value,
      date: moment().format("Do MMMM, YYYY | h:mm"),
      userAvatar: userAvatar,
      timeStamp: Date.now().toString(),
    });

    keyboardHide();
  };

  const sbmComment = () => {
    createPost();
    setComment("");
  };

  const getAllPosts = async () => {
    const commentsRef = collection(db, "posts", postId, "comments");

    onSnapshot(commentsRef, (querySnapshot) => {
      setComments(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  //fonts
  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const sortPosts = comments.sort(
    (firstPost, secondPost) => firstPost.timeStamp - secondPost.timeStamp
  );

  return (
    <SafeAreaView style={styles.container} onPress={keyboardHide}>
      <View
        style={{ paddingHorizontal: 16, paddingBottom: 60 }}
        onLayout={onLayoutRootView}
      >
        <FlatList
          data={sortPosts}
          ListHeaderComponent={
            <View style={{ marginVertical: 32 }}>
              <Image style={{ ...styles.postImage }} source={{ uri: image }} />
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: "86%",
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                  marginBottom: 24,
                  borderBottomEndRadius: 6,
                  borderBottomStartRadius: 6,
                  borderTopStartRadius: 6,
                  padding: 16,
                }}
              >
                <Text style={styles.commentText}>{item.comment}</Text>
                <Text style={styles.commentDate}>{item.date}</Text>
              </View>
              <View>
                <Image
                  style={{ borderRadius: 100, width: 28, height: 28 }}
                  source={{ uri: item.userAvatar }}
                />
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View
        style={{
          ...styles.inputWrapper,
          paddingBottom: isShowKeyboard ? 280 : 10,
        }}
      >
        <TextInput
          style={styles.commentInput}
          textAlign={"flex-start"}
          placeholder="Комментировать..."
          onFocus={() => {
            setIsShowKeyboard(true);
          }}
          onBlur={() => {
            setIsShowKeyboard(false);
          }}
          value={comment}
          onChangeText={(value) =>
            setComment((prevState) => ({
              ...prevState,
              value,
            }))
          }
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.sendComment}
          // onPress={createPost}
          onPress={sbmComment}
        >
          <Ionicons name="arrow-up-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // justifyContent: "flex-end",
  },
  postImage: { height: 240, borderRadius: 8 },
  inputWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  commentInput: {
    fontFamily: "Roboto-Regular",

    color: "#BDBDBD",
    // marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    height: 50,
    borderRadius: 100,
    backgroundColor: "#F6F6F6",
    padding: 16,
    color: "#212121",
    alignItems: "center",
  },
  sendComment: {
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    width: 34,
    height: 34,
    position: "absolute",
    top: 18,
    right: 24,
  },
  commentText: {
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    color: "#212121",
    marginBottom: 8,
  },
  commentDate: {
    fontFamily: "Roboto-Regular",
    fontSize: 10,
    color: "#BDBDBD",
  },
});
