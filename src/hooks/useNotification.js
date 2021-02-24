import React from "react";
import { firestore } from "../firebase";

function useNotification() {
  const createNotification = async (user, type, document, content) => {
    const ref = await firestore.collection("notifications").doc();
    ref.set({
      user: {
        id: user.id,
        name: user.name,
      },
      type,
      document,
      content,
      date: new Date(),
      read: false,
      id: ref.id,
    });
  };

  const deleteNotification = (id) => {
    return firestore.collection("notifications").doc(id).delete();
  };

  const readNotifications = async (userId) => {
    const query = await firestore
      .collection("notifications")
      .where("user.id", "==", userId)
      .get();
    query.forEach((doc) => doc.ref.update({ read: true }));
  };

  return {
    createNotification,
    deleteNotification,
    readNotifications,
  };
}

export default useNotification;
