import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ListHeaderComponent,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as ImagePicker from "expo-image-picker";

import {
  FontAwesome,
  SimpleLineIcons,
  AntDesign,
  Feather,
} from "@expo/vector-icons";

const POSTS = [
  {
    id: "123",
    name: "Лес",
    location: " Ukraine",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
  },
  {
    id: "1234",
    name: "Море",
    location: " Ukraine",
    image:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=652&q=80",
  },
  {
    id: "1235",
    name: "Гори",
    location: " Ukraine",
    image:
      "https://images.unsplash.com/photo-1602130707301-2f09f9d68179?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  },
];

const USER_DATA = {
  login: "Natali Romanova",
  email: "email@example.com",
  image: "../../assets/images/Photo_BG.png",
};

export const DefaultProfileScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);

  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );
  const [posts, setPosts] = useState(POSTS);
  const [userData, setUserData] = useState(USER_DATA);

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

  // img load
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // setState((prevState) => ({
      //   ...prevState,
      //   image: result.assets[0].uri,
      // }));
    }
  };
  const addImg = () => {
    return (
      <TouchableOpacity
        title="Pick an image from camera roll"
        onPress={pickImage}
      >
        <View style={{ backgroundColor: "#fff", borderRadius: 100 }}>
          <AntDesign name="pluscircleo" size={24} color="#FF6C00" />
        </View>
      </TouchableOpacity>
    );
  };

  const delleteImg = () => {
    return (
      <TouchableOpacity
        title="Pick an image from camera roll"
        onPress={() => setImage(null)}
      >
        <View style={{ backgroundColor: "#fff", borderRadius: 100 }}>
          <Feather name="x-circle" size={24} color="#E8E8E8" />
        </View>
      </TouchableOpacity>
    );
  };

  const imgAddBtn = (image) => {
    return image ? delleteImg() : addImg();
  };

  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onLayout={onLayoutRootView}
    >
      <ImageBackground
        style={styles.image}
        source={require("../../assets/images/Photo_BG.png")}
      >
        <View
          style={{
            ...styles.formWrapper,
            width: dimensions + 16 * 2,
          }}
        >
          {/* // userAvatar */}
          <View
            style={{
              width: dimensions,
              alignItems: "center",
            }}
          >
            <View style={styles.imgWrapper}>
              {image && <Image source={{ uri: image }} style={styles.img} />}
              <View style={styles.addImgBtnWrapper}>{imgAddBtn(image)}</View>
            </View>

            {/* // logout btn */}
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => console.log("logout")}
            >
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>

            {/* //postList */}
            <FlatList
              data={posts}
              ListHeaderComponent={
                <Text style={styles.userName}>{userData.login}</Text>
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
                    <View style={styles.helperWrapper}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={{ ...styles.commentWrapper, marginRight: 24 }}
                        onPress={() => navigation.navigate("Comments")}
                      >
                        <FontAwesome name="comment" size={24} color="#FF6C00" />
                        <Text style={styles.commentCount}>0</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.commentWrapper}
                        // onPress={() => navigation.navigate("Comments")}
                      >
                        <AntDesign name="like2" size={24} color="#FF6C00" />
                        <Text style={styles.commentCount}>0</Text>
                      </TouchableOpacity>
                    </View>
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
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
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
  helperWrapper: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  commentWrapper: { flexDirection: "row", alignItems: "center" },
  commentCount: {
    marginLeft: 6,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#212121",
  },
  locationLink: {
    marginLeft: 6,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    textDecorationLine: "underline",
    color: "#212121",
  },
  formWrapper: {
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 150,
  },
  imgWrapper: {
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    height: 120,
    width: 120,
    borderRadius: 16,
    borderColor: "#E8E8E8",
    marginTop: -60,
    marginBottom: 32,
  },
  img: { resizeMode: "cover", height: 120, width: 120, borderRadius: 16 },
  addImgBtnWrapper: {
    position: "absolute",
    bottom: 14,
    right: -12,
  },
  userName: {
    fontFamily: "Roboto-Regular",
    fontSize: 30,
    textAlign: "center",
    color: "#212121",
    // marginTop: 32,
  },
  logoutBtn: {
    position: "absolute",
    top: 22,
    right: 0,
  },
});
