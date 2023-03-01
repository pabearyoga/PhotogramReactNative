import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ListHeaderComponent,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { FontAwesome, SimpleLineIcons } from "@expo/vector-icons";

const POSTS = [
  {
    id: "123",
    name: "Лес",
    location: "Ivano-Frankivs'k Region, Ukraine",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
  },
  {
    id: "1234",
    name: "Море",
    location: "Kherson Region, Ukraine",
    image:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=652&q=80",
  },
  {
    id: "1235",
    name: "Гори",
    location: "Ivano-Frankivs'k Region, Ukraine",
    image:
      "https://images.unsplash.com/photo-1602130707301-2f09f9d68179?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  },
];

const USER_DATA = {
  login: "Natali Romanova",
  email: "email@example.com",
  image: "../../assets/images/Photo_BG.png",
};

export const DefaultPostsScreen = ({ navigation, route }) => {
  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(USER_DATA);

  // postData
  useEffect(() => {
    if (route.params) {
      setPosts((prevState) => [...prevState, route.params.state]);
    }
  }, [route.params]);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: dimensions }} onLayout={onLayoutRootView}>
        <FlatList
          data={posts}
          ListHeaderComponent={
            <View style={styles.userInfoWrapper}>
              <Image
                style={styles.userImg}
                source={require("../../assets/images/Rectangle_22.png")}
              />
              <View style={styles.userTitle}>
                <Text style={styles.loginTitle}>{userData.login}</Text>
                <Text style={styles.emailTitle}>{userData.email}</Text>
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
                  onPress={() => navigation.navigate("Comments")}
                >
                  <FontAwesome name="comment-o" size={24} color="#BDBDBD" />
                  <Text style={styles.commentCount}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.commentWrapper}
                  onPress={() => navigation.navigate("Map")}
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
