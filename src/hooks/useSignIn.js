import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function useSignIn() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { signIn } = useAuth();

  async function handleSignIn() {
    setEmailError("");
    setPasswordError("");
    let areFieldsFilled = true;

    if (!password) {
      setPasswordError("This field is required");
      areFieldsFilled = false;
    }

    if (!email) {
      setEmailError("This field is required");
      areFieldsFilled = false;
    }
    if (!areFieldsFilled) return;

    setLoading(true);

    try {
      await signIn(email, password);
      setMessage("You are now logged in. You will soon be redirected.");
      setLoading(false);
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setEmailError("Incorrect password or username.");
          setPasswordError("Incorrect password or username.");
          setLoading(false);
          break;
        default:
          setPasswordError("Sorry, the sign in failed.");
          setLoading(false);
      }
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    message,
    loading,
    handleSignIn,
  };
}

export default useSignIn;
