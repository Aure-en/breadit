import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function useSignIn() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { resetPassword } = useAuth();

  const handleForgotPassword = async () => {
    setEmailError("");
    setMessage("");

    if (!email) {
      setEmailError("This field is required");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);
      setMessage(
        "Thanks! You will receive an email with a link to reset your password shortly."
      );
      setLoading(false);
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
          setEmailError("Fix this email to continue.");
          break;
        case "auth/user-not-found":
          setEmailError(
            "Sorry, we could not find an account linked to this email address."
          );
          break;
        default:
          setMessage("Sorry, we were unable to reset your password.");
      }
    }
  };

  return {
    email,
    setEmail,
    emailError,
    loading,
    message,
    handleForgotPassword,
  };
}

export default useSignIn;
