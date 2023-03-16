import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
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

//icons
import {
  FontAwesome,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

//font
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

//camera
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

//location
import * as Location from "expo-location";

//storage
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/config";

const initialState = {
  name: "",
  locationCoords: "",
  location: "",
  image: "",
};

export const CreatePostsScreen = ({ navigation }) => {
  // camera
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  // load img
  const [image, setImage] = useState(null);
  const [loaderDisabled, setLoaderDisabled] = useState(false);

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

  const { userId, nickName } = useSelector((stateRedux) => stateRedux.auth);

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

  //camera
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();
  }, []);

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

  //location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }
    })();
  }, []);

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

  // btnSubmitDisabled
  const isFormValid =
    state.name && state.location && state.image && state.location;

  const btnSubmitDisabled = (isFormValid) => {
    return isFormValid
      ? { ...styles.btn, backgroundColor: "#F6F6F6" }
      : styles.btn;
  };

  const btnTitleDisabled = (isFormValid) => {
    return isFormValid
      ? { ...styles.btnTitle, color: "#BDBDBD" }
      : styles.btnTitle;
  };

  // takePhoto
  const takePhoto = async () => {
    if (cameraRef && !image) {
      setLoaderDisabled(true);
      const { uri } = await cameraRef.takePictureAsync();
      setImage(uri);
      const location = await Location.getCurrentPositionAsync();
      setState((prevState) => ({
        ...prevState,
        image: uri,
        locationCoords: location,
      }));
      setLoaderDisabled(false);
    }

    // image && setImage(null);
    if (image) {
      setImage(null);
      setState((prevState) => ({
        ...prevState,
        image: "",
      }));
    }
  };

  const imgLoad = (statImg) => {
    return statImg.image
      ? statImg.image
      : "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921";
  };

  //send form
  const formSubmit = () => {
    uploadPostToServer();

    setTimeout(() => {
      setImage(null);
      setState(initialState);
    }, 500);

    navigation.navigate("Публикации", { state });
  };

  // storage
  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();

    const createPost = await addDoc(collection(db, "posts"), {
      ...state,
      image: photo,
      userId: userId,
      nickName: nickName,
    });
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(image);
    const file = await response.blob();

    const uniquePostId = Date.now().toString();

    const storage = getStorage();
    const storageRef = ref(storage, `images/${uniquePostId}`);

    await uploadBytes(storageRef, file);

    const processedPhoto = await getDownloadURL(
      ref(storage, `images/${uniquePostId}`)
    );

    return processedPhoto;
  };

  // clear form
  const clearForm = () => {
    setImage(null);
    setState(initialState);
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
            {/* Camera */}
            <Camera
              style={styles.camera}
              type={type}
              ref={(ref) => {
                setCameraRef(ref);
              }}
            >
              {image && (
                <Image
                  source={{ uri: imgLoad(state) }}
                  style={{ ...styles.img, width: dimensions }}
                />
              )}
              <View style={styles.photoView}>
                {!image && (
                  <TouchableOpacity
                    style={styles.flipContainer}
                    onPress={() => {
                      setType(
                        type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back
                      );
                    }}
                  >
                    <MaterialCommunityIcons
                      name="camera-flip-outline"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={imgBtnStyle(image)}
                  title="Pick an image from camera roll"
                  onPress={takePhoto}
                  disabled={loaderDisabled}
                >
                  <FontAwesome
                    name="camera"
                    size={18}
                    color={imgIconColor(image)}
                  />
                </TouchableOpacity>
              </View>
            </Camera>
            {/* Camera */}
            <Text style={styles.bottomTitleImg}>{bottomTitleImg(image)}</Text>
            {/* Form */}
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
                style={btnSubmitDisabled(!isFormValid)}
                onPress={formSubmit}
                disabled={!isFormValid}
              >
                <Text style={btnTitleDisabled(!isFormValid)}>Опубликовать</Text>
              </TouchableOpacity>
            </View>
            {/* Form */}
            {/* Reset */}
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 120,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.clearBtn}
                onPress={clearForm}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={24}
                  color="#DADADA"
                />
              </TouchableOpacity>
            </View>
            {/* Reset */}
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
  img: { resizeMode: "cover", height: 240, borderRadius: 8 },
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
  clearBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    width: 70,
    height: 40,
    borderRadius: 50,
  },
  camera: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    height: 240,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E8E8E8",
    marginTop: 32,
    overflow: "hidden",
  },
  photoView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  flipContainer: { position: "absolute", bottom: 10 },
});
