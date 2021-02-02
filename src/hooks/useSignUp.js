import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useUser from "./useUser";

function useSignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, updateUsername, updatePicture } = useAuth();
  const { createUser, isUsernameAvailable } = useUser();

  const checkUsername = async (username) => {
    if (!username) {
      setUsernameError("This field is required.");
      return false;
    }

    if (!(await isUsernameAvailable(username))) {
      setUsernameError("That username is already taken.");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const checkEmail = async (email) => {
    if (!email) {
      setEmailError("This field is required");
      return false;
    }
  };

  const checkPassword = (password) => {
    if (!password) {
      setPasswordError("This field is required");
      return false;
    }

    if (password.length < 6) {
      setPasswordError("The password must be 6 characters long or more");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateForm = (username, email, password) => {
    return (
      checkUsername(username) && checkEmail(email) && checkPassword(password)
    );
  };

  const handleSignUp = async (username, email, password) => {
    if (!validateForm(username, email, password)) return;
    setLoading(true);
    try {
      const user = await signUp(email, password);
      updateUsername(user.user, username);
      updatePicture(user.user, "defaultpic");
      if (user) await createUser(user.user.uid, username);
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
          setEmailError("Fix your email to continue");
          break;
        case "email-already-in-use":
          setEmailError("This email already belongs to an user");
          break;
        case "weak-password":
          setPasswordError("The password must be 6 characters long or more");
          break;
        default:
      }
    }
    setLoading(false);
  };

  return {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    emailError,
    passwordError,
    usernameError,
    loading,
    checkUsername,
    checkEmail,
    checkPassword,
    handleSignUp,
  };
}

export default useSignUp;
