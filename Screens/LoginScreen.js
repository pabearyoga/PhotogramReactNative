import React, { useState, useEffect } from "react";
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

const initialState = {
  email: "",
  password: "",
};

export default function LoginScreen() {
  // console.log(Platform.OS);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  // const [isReady, setIsReady] = useState(false);
  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [isSecurePassword, setIsSecurePassword] = useState(true);
  const [loginFocus, setLoginFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const focusInputStyle = (focus) => {
    return focus ? { ...styles.input, ...styles.inputFocus } : styles.input;
  };

  // useEffect(() => {
  //   const onChange = () => {
  //     const width = Dimensions.get("window").width - 16 * 2;

  //     setDimensions(width);
  //   };
  //   Dimensions.addEventListener("change", onChange);
  //   return () => {
  //     Dimensions.addEventListener("change", onChange).remove();
  //   };
  // });

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;
      const screenWidth = Dimensions.get("window").width;

      setDimensions(width);
      setScreenWidth(screenWidth);
    };
    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription.remove();
  });

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const formSubmit = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    setState(initialState);
    setIsSecurePassword(true);
    console.log(state);
  };

  const passwordShown = () => {
    isSecurePassword === true
      ? setIsSecurePassword(false)
      : setIsSecurePassword(true);
  };

  const showPasswordBtn = isSecurePassword ? "Показать" : "Cкрыть";

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={require("../assets/images/Photo_BG.png")}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <View style={{ ...styles.formWrapper, width: screenWidth }}>
              <View
                style={{
                  ...styles.form,
                  marginBottom: isShowKeyboard ? -100 : 190,
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
                    onBlur={() => setLoginFocus(false)}
                    value={state.email}
                    onChangeText={(value) =>
                      setState((prevState) => ({
                        ...prevState,
                        email: value,
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
                    onBlur={() => setPasswordFocus(false)}
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
                      {/* показать */}
                      {showPasswordBtn}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{ ...styles.btn }}
                  onPress={formSubmit}
                >
                  <Text style={styles.btnTitle}>Войти!!!</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.registerLink}
                  // onPress={keyboardHide}
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
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  form: {
    // marginHorizontal: 200,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    padding: 16,
  },
  inputFocus: { backgroundColor: "#fff", borderColor: "#FF6C00" },
  inputTitle: {
    color: "#BDBDBD",
    marginBottom: 10,
    fontSize: 16,

    // fontFamily: "Roboto-Regulat",
  },
  btn: {
    borderRadius: 100,
    borderWidth: 1,
    height: 51,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 43,
    backgroundColor: "#FF6C00",
    borderColor: "transparent",
  },
  btnTitle: {
    color: "#ffffff",
    fontSize: 16,
    // fontFamily: "Roboto-Regulat",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 32,
  },
  headerTitle: {
    // fontFamily: "Roboto-Regular",
    // fontWeight: 900,
    fontSize: 30,
    color: "#212121",
  },
  registerLink: {
    alignItems: "center",
    marginTop: 16,
  },
  registerLinkTitle: {
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
