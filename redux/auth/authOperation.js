import { app } from "../../firebase/config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

import { authSlice } from "./authReducer";

export const authSignUpUser =
  ({ login, email, password }) =>
  async (dispatch, getSatte) => {
    // console.log("login, email, password", login, email, password);
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);

      const user = await getAuth().currentUser;

      await updateProfile(user, {
        displayName: login,
      });

      const { displayName, uid } = await getAuth().currentUser;

      const userUpdateProfile = {
        userId: uid,
        nickName: displayName,
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
      const user = await signInWithEmailAndPassword(getAuth(), email, password);
      //   console.log("user", user);
    } catch (error) {
      console.log("error", error);
      console.log("error.message", error.message);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {};

export const authStateCahngeUser = () => async (dispatch, getState) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userUpdateProfile = {
        userId: user.uid,
        nickName: user.displayName,
      };

      const stateChange = {
        stateChange: true,
      };

      dispatch(authSlice.actions.authStateChange(stateChange));
      dispatch(authSlice.actions.updateUserProfile(userUpdateProfile));
    }
  });
};
