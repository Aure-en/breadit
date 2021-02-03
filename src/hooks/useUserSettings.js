import { useState, useEffect } from "react";
import firebase from "firebase";
import { useAuth } from "../contexts/AuthContext";
import { firestore } from "../firebase";
import useStorage from "./useStorage";

function useUserSettings() {
  const { currentUser, updatePicture } = useAuth();
  const { uploadImage } = useStorage();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [
    newPasswordConfirmationError,
    setNewPasswordConfirmationError,
  ] = useState("");

  const [about, setAbout] = useState("");
  const [aboutMessage, setAboutMessage] = useState("");
  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    setAvatar(currentUser.photoURL);
  }, [currentUser]);

  // Check if the user entered the right password before updating his data.
  const checkPassword = async () => {
    const credential = await firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );
    try {
      await currentUser.reauthenticateWithCredential(credential);
      return true;
    } catch (err) {
      setCurrentPasswordError(
        "Enter your password properly to save the changes."
      );
    }
    return false;
  };

  // When the user changes password, check if they entered the new password properly twice.
  const checkNewPasswords = () => {
    if (newPassword !== newPasswordConfirmation) {
      setNewPasswordError(
        "New password and password confirmation do not match."
      );
      setNewPasswordConfirmationError(
        "New password and password confirmation do not match."
      );
      return false;
    }
    return true;
  };

  const handleUpdateEmail = async () => {
    if (!(await checkPassword())) return;
    try {
      await currentUser.updateEmail(email);
      setEmail(email);
      setMessage("Your email address was successfully updated.");
      return true;
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
          setEmailError("Not a well formed email address.");
          break;
        case "auth/email-already-in-use":
          setEmailError("This email is already registered.");
          break;
        default:
      }
      setMessage("Sorry, we were unable to update your information.");
    }
    return false;
  };

  const handleUpdatePassword = async () => {
    if (!checkNewPasswords()) return;
    if (!(await checkPassword())) return;
    try {
      await currentUser.updatePassword(newPassword);
      setMessage("Your password was successfully updated.");
      return true;
    } catch (err) {
      switch (err.code) {
        case "weak-password":
          setNewPasswordError("Must be 6 or more in length.");
          break;
        default:
      }
      setMessage("Sorry, we were unable to update your information.");
      return false;
    }
  };

  const handleDeleteAccount = async () => {
    if (!(await checkPassword())) return;
    await currentUser.delete();
  };

  const handleUpdateAbout = async () => {
    setAboutMessage("");
    try {
      await firestore
        .collection("users")
        .doc(currentUser.uid)
        .update({ about });
      setAboutMessage("Your description was successfully updated.");
    } catch (err) {
      setAboutMessage("Sorry, we were unable to update your description.");
    }
  };

  const handleUpdateAvatar = async (image) => {
    const imageUrl = await uploadImage(image);
    updatePicture(currentUser, imageUrl);
    setAvatar(imageUrl);
  };

  const reset = () => {
    setEmail("");
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirmation("");
    setEmailError("");
    setCurrentPasswordError("");
    setNewPasswordError("");
    setNewPasswordConfirmationError("");
    setMessage("");
  };

  return {
    email,
    setEmail,
    emailError,
    currentPassword,
    setCurrentPassword,
    currentPasswordError,
    newPassword,
    setNewPassword,
    newPasswordError,
    newPasswordConfirmation,
    setNewPasswordConfirmation,
    newPasswordConfirmationError,
    message,
    setMessage,
    about,
    setAbout,
    aboutMessage,
    avatar,
    reset,
    handleUpdateAbout,
    handleUpdateEmail,
    handleUpdatePassword,
    handleUpdateAvatar,
    handleDeleteAccount,
  };
}

export default useUserSettings;
