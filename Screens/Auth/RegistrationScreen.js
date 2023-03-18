import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as ImagePicker from "expo-image-picker";

import { AntDesign, Feather } from "@expo/vector-icons";

import { useDispatch } from "react-redux";
import { authSignUpUser } from "../../redux/auth/authOperation";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const initialState = {
  login: "",
  email: "",
  password: "",
  image: "",
};

export default function RegistrationScreen({ navigation }) {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [image, setImage] = useState(null);

  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );
  const [dimensionsHeigth, setDimensionsHeigth] = useState(
    Dimensions.get("window").height
  );

  const [isSecurePassword, setIsSecurePassword] = useState(true);
  const [emailFocus, setEmailFocus] = useState(false);
  const [loginFocus, setLoginFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const dispatch = useDispatch();

  const focusInputStyle = (focus) => {
    return focus ? { ...styles.input, ...styles.inputFocus } : styles.input;
  };

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

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const passwordShown = () => {
    isSecurePassword === true
      ? setIsSecurePassword(false)
      : setIsSecurePassword(true);
  };

  const showPasswordBtn = isSecurePassword ? "Показать" : "Cкрыть";

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

  const formSubmit = async () => {
    const photo = image
      ? await uploadPhotoToServer()
      : "https://img.myloview.com/stickers/default-avatar-profile-icon-vector-social-media-user-image-700-205124837.jpg";
    dispatch(authSignUpUser({ ...state, image: photo }));
  };

  // storage;
  const uploadPhotoToServer = async () => {
    const response = await fetch(image);
    const file = await response.blob();

    const uniquePostId = Date.now().toString();

    const storage = getStorage();
    const storageRef = ref(storage, `avatar/${uniquePostId}`);

    await uploadBytes(storageRef, file);

    const processedPhoto = await getDownloadURL(
      ref(storage, `avatar/${uniquePostId}`)
    );

    return processedPhoto;
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View
        style={{
          ...styles.container,
        }}
        onLayout={onLayoutRootView}
      >
        <ImageBackground
          style={styles.image}
          source={require("../../assets/images/Photo_BG.png")}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <View
              style={{
                ...styles.formWrapper,
                width: dimensions + 16 * 2,
                marginTop: dimensions > dimensionsHeigth ? 200 : 0,
              }}
            >
              <View style={styles.imgWrapper}>
                {image && <Image source={{ uri: image }} style={styles.img} />}
                <View style={styles.addImgBtnWrapper}>{imgAddBtn(image)}</View>
              </View>

              <View
                style={{
                  marginBottom: isShowKeyboard ? -100 : 100,
                  width: dimensions,
                }}
              >
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Регистрация</Text>
                </View>
                <View>
                  <TextInput
                    style={focusInputStyle(loginFocus)}
                    textAlign={"flex-start"}
                    placeholder="Логин"
                    onFocus={() => {
                      setIsShowKeyboard(true), setLoginFocus(true);
                    }}
                    onBlur={() => {
                      setIsShowKeyboard(false), setLoginFocus(false);
                    }}
                    value={state.login}
                    onChangeText={(value) =>
                      setState((prevState) => ({
                        ...prevState,
                        login: value,
                      }))
                    }
                  />
                </View>

                <View style={{ marginTop: 16 }}>
                  <TextInput
                    style={focusInputStyle(emailFocus)}
                    textAlign={"flex-start"}
                    placeholder="Адрес электронной почты"
                    onFocus={() => {
                      setIsShowKeyboard(true), setEmailFocus(true);
                    }}
                    onBlur={() => {
                      setIsShowKeyboard(false), setEmailFocus(false);
                    }}
                    value={state.email}
                    onChangeText={(value) =>
                      setState((prevState) => ({
                        ...prevState,
                        email: value.toLowerCase(),
                      }))
                    }
                  />
                </View>
                <View style={{ marginTop: 16 }}>
                  <TextInput
                    style={focusInputStyle(passwordFocus)}
                    textAlign={"flex-start"}
                    placeholder="Пароль"
                    secureTextEntry={isSecurePassword}
                    onFocus={() => {
                      setIsShowKeyboard(true), setPasswordFocus(true);
                    }}
                    onBlur={() => {
                      setIsShowKeyboard(false), setPasswordFocus(false);
                    }}
                    value={state.password}
                    onChangeText={(value) =>
                      setState((prevState) => ({
                        ...prevState,
                        password: value,
                      }))
                    }
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.passwordShowBtn}
                    onPress={passwordShown}
                  >
                    <Text style={styles.registerLinkTitle}>
                      {showPasswordBtn}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.btn}
                  onPress={formSubmit}
                >
                  <Text style={styles.btnTitle}>Зарегистрироваться</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.registerLink}
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  <Text style={styles.registerLinkTitle}>
                    Уже есть аккаунт? Войти
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    position: "absolute",
    top: -60,
  },
  addAvatarBtn: {
    position: "absolute",
    bottom: 20,
    right: -12,
    borderWidth: 1,
    borderColor: "#FF6C00",
    borderRadius: 100,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addAvatarBtnTitle: {
    color: "#FF6C00",
  },
  formWrapper: {
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  input: {
    fontFamily: "Roboto-Regular",

    color: "#BDBDBD",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    padding: 16,
    color: "#212121",
  },
  inputFocus: { backgroundColor: "#fff", borderColor: "#FF6C00" },
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
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 92,
  },
  headerTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    color: "#212121",
  },
  registerLink: {
    alignItems: "center",
    marginTop: 16,
  },
  registerLinkTitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#1B4371",
    alignItems: "center",
  },
  passwordShowBtn: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  imgWrapper: {
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    height: 120,
    width: 120,
    borderRadius: 16,
    borderColor: "#E8E8E8",
    marginTop: -60,
  },
  img: { resizeMode: "cover", height: 120, width: 120, borderRadius: 16 },
  addImgBtnWrapper: {
    position: "absolute",
    bottom: 14,
    right: -12,
  },
});
