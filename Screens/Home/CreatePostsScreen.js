import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome, SimpleLineIcons } from "@expo/vector-icons";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const initialState = {
  name: "",
  location: "",
};

export const CreatePostsScreen = () => {
  // load img
  const [image, setImage] = useState(null);
  // input
  const [state, setState] = useState(initialState);
  const [nameFocus, setNameFocus] = useState(false);
  const [locationFocus, setLocationFocus] = useState(false);
  // screen width
  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );
  const [dimensionsHeigth, setDimensionsHeigth] = useState(
    Dimensions.get("window").height
  );
  // keyboard
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  //img
  const imgBtnStyle = (image) => {
    return image
      ? { ...styles.addImgBtn, ...styles.updImgBtn }
      : styles.addImgBtn;
  };

  const imgIconColor = (image) => {
    return image ? "#fff" : "#BDBDBD";
  };

  const bottomTitleImg = (image) => {
    return image ? "Редактировать фото" : "Загрузите фото";
  };

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
    }
  };

  // width screen
  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;
      const height = Dimensions.get("window").height;

      setDimensions(width);
      setDimensionsHeigth(height);
    };
    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription.remove();
  });

  //font
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

  // keyboard

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  // input
  const focusInputStyle = (focus) => {
    return focus ? { ...styles.input, ...styles.inputFocus } : styles.input;
  };

  const formSubmit = () => {
    setImage(null);
    setState(initialState);
    console.log(state);
  };
  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <View
            style={{
              marginTop: isShowKeyboard ? -50 : 0,
              width: dimensions,
            }}
          >
            <View style={styles.imgWrapper}>
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ ...styles.img, width: dimensions }}
                />
              )}
              <View style={styles.addImgBtnWrapper}>
                <TouchableOpacity
                  style={imgBtnStyle(image)}
                  title="Pick an image from camera roll"
                  onPress={pickImage}
                >
                  <FontAwesome
                    name="camera"
                    size={18}
                    color={imgIconColor(image)}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.bottomTitleImg}>{bottomTitleImg(image)}</Text>
            <View style={styles.formWrapper}>
              <View>
                <TextInput
                  style={focusInputStyle(nameFocus)}
                  textAlign={"flex-start"}
                  placeholder="Название..."
                  onFocus={() => {
                    setIsShowKeyboard(true), setNameFocus(true);
                  }}
                  onBlur={() => {
                    setIsShowKeyboard(false), setNameFocus(false);
                  }}
                  value={state.name}
                  onChangeText={(value) =>
                    setState((prevState) => ({
                      ...prevState,
                      name: value,
                    }))
                  }
                />
              </View>
              <View
                style={{
                  marginTop: 16,
                }}
              >
                <TextInput
                  style={{ ...focusInputStyle(locationFocus), paddingLeft: 28 }}
                  textAlign={"flex-start"}
                  placeholder="Местность..."
                  onFocus={() => {
                    setIsShowKeyboard(true), setLocationFocus(true);
                  }}
                  onBlur={() => {
                    setIsShowKeyboard(false), setLocationFocus(false);
                  }}
                  value={state.location}
                  onChangeText={(value) =>
                    setState((prevState) => ({
                      ...prevState,
                      location: value,
                    }))
                  }
                />
                <SimpleLineIcons
                  name="location-pin"
                  size={18}
                  color="#BDBDBD"
                  style={styles.locationIcon}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.btn}
                onPress={formSubmit}
              >
                <Text style={styles.btnTitle}>Опубликовать</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  imgWrapper: {
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    height: 240,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E8E8E8",
    marginTop: 32,
  },
  img: { resizeMode: "cover", height: 240, borderRadius: 8 },
  addImgBtnWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  addImgBtn: {
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  updImgBtn: { backgroundColor: "rgba(255, 255, 255, 0.3)" },
  bottomTitleImg: {
    fontFamily: "Roboto-Regular",
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
    marginTop: 8,
  },
  formWrapper: { marginTop: 32 },
  input: {
    fontFamily: "Roboto-Regular",

    color: "#BDBDBD",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    height: 50,
    color: "#212121",
    paddingVertical: 16,
  },
  inputFocus: { backgroundColor: "#fff", borderColor: "#FF6C00" },
  locationIcon: {
    position: "absolute",
    top: 15,
    left: 2,
  },
  btn: {
    borderRadius: 100,
    borderWidth: 1,
    height: 51,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6C00",
    borderColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  btnTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
  },
});
