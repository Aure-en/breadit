import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

const EntryContext = React.createContext();

export function useEntry() {
  return useContext(EntryContext);
}

export function EntryProvider({ children }) {
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("signUp");

  const openSignUp = () => {
    if (currentTab !== "signUp") setCurrentTab("signUp");
    setIsEntryModalOpen(true);
  };

  const openSignIn = () => {
    if (currentTab !== "signIn") setCurrentTab("signIn");
    setIsEntryModalOpen(true);
  };

  const closeEntry = () => {
    setIsEntryModalOpen(false);
  };

  const value = {
    isEntryModalOpen,
    currentTab,
    setCurrentTab,
    openSignUp,
    openSignIn,
    closeEntry,
  };

  EntryProvider.propTypes = {
    children: PropTypes.node,
  };

  EntryProvider.defaultProps = {
    children: <div />,
  };

  return (
    <EntryContext.Provider value={value}>{children}</EntryContext.Provider>
  );
}
