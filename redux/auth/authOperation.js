import { app, db } from "../../firebase/config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { authSlice } from "./authReducer";

// import {
//   saveAuthenticationState,
//   getAuthenticationState,
//   deleteAuthenticationState,
// } from "../../helper/SecureStore";

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
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  const auth = getAuth();
  await auth.signOut();
  dispatch(authSlice.actions.authSignOut());
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  try {
    const auth = getAuth();

    auth.onAuthStateChanged((user) => {
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
