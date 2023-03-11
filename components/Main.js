import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { useRoute } from "../router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Main = () => {
  const [user, setUser] = useState(null);

  const state = useSelector((state) => state);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });
  const routing = useRoute(user);
  useEffect(() => {}, []);
  return <NavigationContainer>{routing}</NavigationContainer>;
};

export default Main;
