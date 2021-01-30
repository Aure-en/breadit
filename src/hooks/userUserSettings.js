import { useState } from "react";
import firebase from "firebase";
import { useAuth } from "../contexts/AuthContext";

function useUserSettings() {
  const { currentUser } = useAuth();

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

  const [message, setMessage] = useState("");

  const clearErrors = () => {
    setEmailError("");
    setCurrentPasswordError("");
    setNewPasswordError("");
    setNewPasswordConfirmationError("");
    setMessage("");
  };

  const checkPassword = async () => {
    const credential = firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );
    try {
      await currentUser.reauthenticateWithCredential(credential);
      return true;
    } catch (err) {
      switch (err.code) {
        case "wrong-password":
          setCurrentPasswordError(
            "Enter your password properly to save the changes."
          );
          break;
        default:
      }
      return false;
    }
  };

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
    const isPasswordCorrect = await checkPassword();
    if (!isPasswordCorrect) return;
    try {
      await currentUser.updateEmail(email);
      setEmail(email);
      setMessage("Your information was successfully updated.");
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
          setEmailError("Not a well formed email address.");
          break;
        case "auth/email-already-in-use":
          setEmailError("Email is already registered.");
          break;
        default:
      }
      setMessage("Sorry, we were unable to update your information.");
    }
  };

  const handleUpdatePassword = async () => {
    if (!checkNewPasswords()) return;
    const isPasswordCorrect = await checkPassword();
    if (!isPasswordCorrect) return;
    try {
      await currentUser.updatePassword(newPassword);
      setMessage("Your information was successfully updated.");
      setNewPassword("");
      setNewPasswordConfirmation("");
      setCurrentPassword("");
    } catch (err) {
      switch (err.code) {
        case "weak-password":
          setNewPasswordError("Must be 6 or more in length.");
          break;
        default:
      }
      setMessage("Sorry, we were unable to update your information.");
    }
  };

  const handleDeleteAccount = async () => {
    const isPasswordCorrect = await checkPassword();
    if (!isPasswordCorrect) return;
    await currentUser.delete();
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
    clearErrors,
    handleUpdateEmail,
    handleUpdatePassword,
    handleDeleteAccount,
  };
}

export default useUserSettings;
