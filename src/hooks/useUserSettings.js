import firebase from "firebase";
import { firestore } from "../firebase";

function useUserSettings() {
  // Check if the user entered the right password before updating his data.
  const checkPassword = async (user, email, password) => {
    const credential = await firebase.auth.EmailAuthProvider.credential(
      email,
      password
    );
    try {
      await user.reauthenticateWithCredential(credential);
    } catch (err) {
      return err.code;
    }
  };

  // When the user changes password, check if they entered the new password properly twice.
  const checkConfirmation = (password, confirmation) => {
    if (password !== confirmation) {
      return false;
    }
    return true;
  };

  const updateEmail = (user, email) => {
    return user.updateEmail(email);
  };

  const updatePassword = (user, password) => {
    return user.updatePassword(password);
  };

  const deleteAccount = (user) => {
    return user.delete();
  };

  const updateAbout = (user, about) => {
    return firestore.collection("users").doc(user).update({ about });
  };

  const updateAvatar = (user, image) => {
    return firestore.collection("users").doc(user).update({ avatar: image });
  };

  const updateBanner = (user, image) => {
    return firestore.collection("users").doc(user).update({ banner: image });
  };

  return {
    checkPassword,
    checkConfirmation,
    updateEmail,
    updatePassword,
    updateAbout,
    updateAvatar,
    updateBanner,
    deleteAccount,
  };
}

export default useUserSettings;
