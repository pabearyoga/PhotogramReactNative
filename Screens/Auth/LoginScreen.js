import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
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

import { useDispatch } from "react-redux";
import { authSignInUser } from "../../redux/auth/authOperation";

const initialState = {
  email: "",
  password: "",
};

export default function LoginScreen({ navigation }) {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );
  const [dimensionsHeigth, setDimensionsHeigth] = useState(
    Dimensions.get("window").height
  );

  const [isSecurePassword, setIsSecurePassword] = useState(true);
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

  const formSubmit = () => {
    setState(initialState);
    setIsSecurePassword(true);
    dispatch(authSignInUser(state));
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
                // marginBottom: dimensions > dimensionsHeigth ? -150 : 0,
              }}
            >
              <View
                style={{
                  // ...styles.form,
                  marginBottom: isShowKeyboard ? -90 : 170,
                  width: dimensions,
                }}
              >
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Войти</Text>
                </View>
                <View>
                  <TextInput
                    style={focusInputStyle(loginFocus)}
                    textAlign={"flex-start"}
                    placeholder="Адрес электронной почты"
                    onFocus={() => {
                      setIsShowKeyboard(true), setLoginFocus(true);
                    }}
                    onBlur={() => {
                      setIsShowKeyboard(false), setLoginFocus(false);
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
                  <Text style={styles.btnTitle}>Войти</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.registerLink}
                  onPress={() => navigation.navigate("RegistrationScreen")}
                >
                  <Text style={styles.registerLinkTitle}>
                    Нет аккаунта? Зарегистрироваться
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
  formWrapper: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  // form: {
  //   marginHorizontal: 40,
  // },
  input: {
    fontFamily: "Roboto-Regular",

    color: "#BDBDBD",
    // marginBottom: 10,
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
    marginTop: 32,
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
});
