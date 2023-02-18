// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   View,
//   TextInput,
//   Platform,
//   KeyboardAvoidingView,
//   Keyboard,
//   TouchableWithoutFeedback,
//   Button,
// } from "react-native";

// export default function LoginScreen() {
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");

//   const nameHandler = (text) => setName(text);
//   const passwordHandler = (text) => setPassword(text);

//   const onLogin = () => {
//     Alert.alert("Credentials", `${name} + ${password}`);
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={styles.container}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS == "ios" ? "padding" : "height"}
//         >
//           <TextInput
//             value={name}
//             onChangeText={nameHandler}
//             placeholder="Адрес электронной почты"
//             style={styles.input}
//           />
//           <TextInput
//             value={password}
//             onChangeText={passwordHandler}
//             placeholder="Пароль"
//             secureTextEntry={true}
//             style={styles.input}
//           />
//           <Button
//             title={"Войти"}
//             style={styles.button}
//             onPress={onLogin}
//             color="red"
//             backgroundColor="orange"
//           />
//         </KeyboardAvoidingView>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#ecf0f1",
//   },
//   input: {
//     width: 200,
//     height: 44,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#E8E8E8",
//     backgroundColor: "#F6F6F6",
//     marginBottom: 10,
//     borderRadius: 8,
//   },
// });

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

// import * as Font from "expo-font";
// // import { AppLoading } from "expo";
// import AppLoading from "expo-app-loading";

const initialState = {
  email: "",
  password: "",
};

// const loadApplication = async () => {
//   await Font.loadAsync({
//     "DMMono-Regular": require("../assets/fonts/DMMono-Regular.ttf"),
//   });
// };

export default function LoginScreen() {
  // console.log(Platform.OS);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setstate] = useState(initialState);
  const [iasReady, setIasReady] = useState(false);

  const [dimensions, setdimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;

      setdimensions(width);
    };
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    console.log(state);
    setstate(initialState);
  };

  // if (!iasReady) {
  //   return (
  //     <AppLoading
  //       startAsync={loadApplication}
  //       onFinish={() => setIasReady(true)}
  //       onError={console.warn}
  //     />
  //   );
  // }

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
            <View style={styles.formWrapper}>
              <View
                style={{
                  ...styles.form,
                  marginBottom: isShowKeyboard ? 20 : 150,
                  width: dimensions,
                }}
              >
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Войти</Text>
                </View>
                <View>
                  <TextInput
                    style={styles.input}
                    textAlign={"flex-start"}
                    placeholder="Адрес электронной почты"
                    onFocus={() => setIsShowKeyboard(true)}
                    value={state.email}
                    onChangeText={(value) =>
                      setstate((prevState) => ({ ...prevState, email: value }))
                    }
                  />
                </View>
                <View style={{ marginTop: 16 }}>
                  <TextInput
                    style={styles.input}
                    textAlign={"flex-start"}
                    placeholder="Пароль"
                    secureTextEntry={true}
                    onFocus={() => setIsShowKeyboard(true)}
                    value={state.password}
                    onChangeText={(value) =>
                      setstate((prevState) => ({
                        ...prevState,
                        password: value,
                      }))
                    }
                  />
                </View>
                {/* <View> */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.btn}
                  onPress={keyboardHide}
                >
                  <Text style={styles.btnTitle}>Войти</Text>
                </TouchableOpacity>
                {/* </View> */}
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
    width: Dimensions.get("window").width,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  form: {
    marginHorizontal: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    padding: 16,
  },
  inputTitle: {
    color: "#BDBDBD",
    marginBottom: 10,
    fontSize: 16,

    // fontFamily: "DMMono-Regular",
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
    // fontFamily: "DMMono-Regular",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 32,
  },
  headerTitle: {
    fontSize: 40,
    color: "#212121",
  },
});
