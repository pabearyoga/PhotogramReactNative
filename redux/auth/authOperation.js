import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { authSlice } from "./authReducer";

export const authSignUpUser =
  ({ login, userEmail, password, image }) =>
  async (dispatch, getSatte) => {
    try {
      await createUserWithEmailAndPassword(getAuth(), userEmail, password);

      const user = await getAuth().currentUser;

      await updateProfile(user, {
        displayName: login,
        photoURL: image,
      });

      const { displayName, uid, photoURL, email } = await getAuth().currentUser;

      const userUpdateProfile = {
        userId: uid,
        nickName: displayName,
        userAvatar: photoURL,
        userEmail: email,
      };

      dispatch(authSlice.actions.updateUserProfile(userUpdateProfile));
    } catch (error) {
      console.log("error", error);
      console.log("error.message", error.message);
    }
  };

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log("error", error);
      console.log("error.message", error.message);
      if (error.message === "auth/invalid-email" || "auth/wrong-password") {
        alert("Адрес электронной почты или пароль не верны !");
      }
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  const auth = getAuth();
  await signOut(auth);
  dispatch(authSlice.actions.authSignOut());
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  try {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userUpdateProfile = {
          userId: user.uid,
          nickName: user.displayName,
          userAvatar: user.photoURL,
          userEmail: user.email,
        };

        dispatch(authSlice.actions.updateUserProfile(userUpdateProfile));
        dispatch(
          authSlice.actions.authStateChange({
            stateChange: true,
          })
        );
      }
    });
  } catch (error) {
    console.log("error", error);
    console.log("error.message", error.message);
  }
};

export const updUserAvatar = (image) => async (dispatch, getState) => {
  try {
    const user = await getAuth().currentUser;

    await updateProfile(user, {
      photoURL: image,
    });

    const userUpdateProfile = {
      userId: user.uid,
      nickName: user.displayName,
      userAvatar: user.photoURL,
      userEmail: user.email,
    };

    dispatch(authSlice.actions.updateUserProfile(userUpdateProfile));
  } catch (error) {
    console.log("error", error);
    console.log("error.message", error.message);
  }
};
