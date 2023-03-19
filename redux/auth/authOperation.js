import { app } from "../../firebase/config";
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
    // console.log("login, email, password", login, email, password);
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
      //   console.log("user", user);
    } catch (error) {
      console.log("error", error);
      console.log("error.message", error.message);
    }
  };

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getSatte) => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
    } catch (error) {
      console.log("error", error);
      console.log("error.message", error.message);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  const auth = getAuth();
  await signOut(auth);
  dispatch(authSlice.actions.authSignOut());
};

export const authStateCahngeUser = () => async (dispatch, getState) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userUpdateProfile = {
        userId: user.uid,
        nickName: user.displayName,
        userAvatar: user.photoURL,
        userEmail: user.email,
      };

      const stateChange = {
        stateChange: true,
      };

      dispatch(authSlice.actions.authStateChange(stateChange));
      dispatch(authSlice.actions.updateUserProfile(userUpdateProfile));
    }
  });
};
