import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { firestore } from "../firebase";
import { useAuth } from "./AuthContext";

const SaveContext = React.createContext();

export function useSave() {
  return useContext(SaveContext);
}

export function SaveProvider({ children }) {
  const { currentUser } = useAuth();
  const [saved, setSaved] = useState([]);

  // doc can be a post or a comment.
  // We indicate whether it is a post or a comment in the "type"
  // field to look for the document in the proper collection to
  // display it in the "Saved" Tab.
  const save = (userId, docId, type) => {
    return firestore
      .collection("saved")
      .doc(userId)
      .collection("saved")
      .doc(docId)
      .set({
        id: docId,
        date: new Date(),
        type,
      });
  };

  const unsave = (userId, docId) => {
    return firestore
      .collection("saved")
      .doc(userId)
      .collection("saved")
      .doc(docId)
      .delete();
  };

  const getSaved = async (userId) => {
    const savedArr = [];
    const saved = await firestore
      .collection("saved")
      .doc(userId)
      .collection("saved")
      .get();
    saved.docs.forEach((doc) => savedArr.push(doc.data()));
    return savedArr;
  };

  const getSavedIds = async (userId) => {
    const savedArr = [];
    const saved = await firestore
      .collection("saved")
      .doc(userId)
      .collection("saved")
      .get();
    saved.docs.forEach((doc) => savedArr.push(doc.id));
    return savedArr;
  };

  useEffect(() => {
    if (!currentUser) {
      setSaved([]);
      return;
    }
    const unsubscribe = firestore
      .collection("saved")
      .doc(currentUser.uid)
      .collection("saved")
      .onSnapshot(async () => {
        const saved = await getSavedIds(currentUser.uid);
        setSaved(saved);
      });
    return unsubscribe;
  }, [currentUser]);

  const handleSave = (userId, docId, type) => {
    if (saved.includes(docId)) {
      unsave(userId, docId, type);
    } else {
      save(userId, docId, type);
    }
  };

  const value = {
    saved,
    handleSave,
    getSaved,
  };

  SaveProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return <SaveContext.Provider value={value}>{children}</SaveContext.Provider>;
}
