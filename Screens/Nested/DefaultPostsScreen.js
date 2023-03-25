import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
//font
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
//icons
import { FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
//firestore
import { db } from "../../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

export const DefaultPostsScreen = ({ navigation, route }) => {
  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );
  const [posts, setPosts] = useState([]);

  const { nickName, userAvatar, userEmail } = useSelector(
    (stateRedux) => stateRedux.auth
  );

  //firebase
  const getAllPosts = () => {
    const postsRef = collection(db, "posts");
    const postsUnsubscribe = onSnapshot(postsRef, (querySnapshot) => {
      const updatedPosts = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        commentNumber: 0,
      }));

      const commentUnsubscribes = updatedPosts.map((post) =>
        onSnapshot(
          collection(db, "posts", post.id, "comments"),
          (commentsSnapshot) => {
            const commentNumber = commentsSnapshot.docs.length;
            setPosts((prevPosts) =>
              prevPosts.map((prevPost) =>
                prevPost.id === post.id
                  ? { ...prevPost, commentNumber }
                  : prevPost
              )
            );
          }
        )
      );

      setPosts(updatedPosts);

      return () => {
        commentUnsubscribes.forEach((unsubscribe) => unsubscribe());
      };
    });

    return () => {
      postsUnsubscribe();
    };
  };

  useEffect(() => {
    const unsubscribe = getAllPosts();
    return () => unsubscribe();
  }, []);

  // width screen
  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;
      // const height = Dimensions.get("window").height;

      setDimensions(width);
      // setDimensionsHeigth(height);
    };
    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription.remove();
  });

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

  const sortPosts = posts.sort(
    (firstPost, secondPost) => firstPost.timeStamp - secondPost.timeStamp
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: dimensions }} onLayout={onLayoutRootView}>
        <FlatList
          data={sortPosts}
          ListHeaderComponent={
            <View style={styles.userInfoWrapper}>
              <Image style={styles.userImg} source={{ uri: userAvatar }} />
              <View style={styles.userTitle}>
                <Text style={styles.loginTitle}>{nickName}</Text>
                <Text style={styles.emailTitle}>{userEmail}</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View>
              <View style={{ marginTop: 32 }}>
                {/* // postImage */}
                <Image
                  style={{ ...styles.postImage, width: dimensions }}
                  source={{ uri: item.image }}
                />
                {/* // postImgTitle */}
                <Text style={styles.postImgTitle}>{item.name}</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.commentWrapper}
                  onPress={() => navigation.navigate("Comments", { item })}
                >
                  <FontAwesome name="comment-o" size={24} color="#BDBDBD" />
                  <Text style={styles.commentCount}>{item.commentNumber}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.commentWrapper}
                  onPress={() => navigation.navigate("Map", { item })}
                >
                  <SimpleLineIcons
                    name="location-pin"
                    size={24}
                    color="#BDBDBD"
                  />
                  <Text style={styles.locationLink}>{item.location}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, indx) => indx.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  userInfoWrapper: { marginTop: 32 },
  userImg: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  userTitle: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 68,
    right: 0,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  loginTitle: { fontFamily: "Roboto-Medium", fontSize: 13, color: "#212121" },
  emailTitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 11,
    color: "rgba(33, 33, 33, 0.8)",
  },
  postImage: { height: 240, borderRadius: 8 },
  postImgTitle: {
    marginTop: 8,
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: "#212121",
  },
  commentWrapper: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  commentCount: {
    marginLeft: 6,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#BDBDBD",
  },
  locationLink: {
    marginLeft: 6,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    textDecorationLine: "underline",
    color: "#212121",
  },
});
