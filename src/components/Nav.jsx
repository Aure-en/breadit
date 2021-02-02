import React, { useState } from "react";
import Entry from "./entry/Entry";
import { useAuth } from "../contexts/AuthContext";

function Nav() {
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [entryTab, setEntryTab] = useState("signUp");
  const { signOut } = useAuth();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsEntryOpen(true);
          setEntryTab("signUp");
        }}
      >
        Sign Up
      </button>

      <button
        type="button"
        onClick={() => {
          setIsEntryOpen(true);
          setEntryTab("signIn");
        }}
      >
        Sign In
      </button>
      <button type="button" onClick={signOut}>
        Log Out
      </button>

      {isEntryOpen && (
        <Entry close={() => setIsEntryOpen(false)} entryTab={entryTab} />
      )}
    </>
  );
}

export default Nav;