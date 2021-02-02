import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const signUp = async (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const signIn = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const signOut = () => {
    return auth.signOut();
  };

  const updateUsername = (user, username) => {
    user.updateProfile({
      displayName: username,
    });
  };

  const updatePicture = (user, photoURL) => {
    user.updateProfile({
      photoURL,
    });
  };

  const resetPassword = (email) => {
    return auth.sendPasswordResetEmail(email);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    signUp,
    signIn,
    signOut,
    updateUsername,
    updatePicture,
    currentUser,
    resetPassword,
  };

  AuthProvider.propTypes = {
    children: PropTypes.node,
  };

  AuthProvider.defaultProps = {
    children: <div />,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
