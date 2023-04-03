import * as SecureStore from "expo-secure-store";

// Збереження інформації про автентифікацію користувача
export const saveAuthenticationState = async (authState) => {
  try {
    await SecureStore.setItemAsync("authState", JSON.stringify(authState));
  } catch (error) {
    console.error("Error saving authentication state:", error);
  }
};

// Отримання інформації про автентифікацію користувача
export const getAuthenticationState = async () => {
  try {
    const authState = await SecureStore.getItemAsync("authState");
    return authState != null ? JSON.parse(authState) : null;
  } catch (error) {
    console.error("Error getting authentication state:", error);
    return null;
  }
};

// Видалення інформації про автентифікацію користувача
export const deleteAuthenticationState = async () => {
  try {
    await SecureStore.deleteItemAsync("authState");
  } catch (error) {
    console.error("Error deleting authentication state:", error);
  }
};
