import { firestore } from "../firebase";

function useMessage() {
  const sendMessage = async (sender, recipient, content) => {
    const ref = await firestore.collection("messages").doc();
    ref.set({
      sender: {
        id: sender.id,
        name: sender.name,
      },
      recipient: {
        id: recipient.id,
        name: recipient.name,
      },
      content,
      id: ref.id,
      date: new Date(),
      read: false,
      deleted: false,
    });
  };

  const readMessages = async (userId) => {
    const query = await firestore
      .collection("messages")
      .where("recipient.id", "==", userId)
      .where("read", "==", false)
      .get();
    query.forEach((doc) => doc.ref.update({ read: true }));
  };

  const deleteMessage = (id) => {
    return firestore.collection("messages").doc(id).update({ deleted: true });
  };

  const getSentMessages = async (userId, limit) => {
    const messagesArr = [];
    const messages = await firestore
      .collection("messages")
      .where("sender.id", "==", userId)
      .orderBy("date", "desc")
      .limit(limit)
      .get();
    messages.forEach((notification) => messagesArr.push(notification.data()));
    return messagesArr;
  };

  const getMessages = async (userId, limit) => {
    const messagesArr = [];
    const messages = await firestore
      .collection("messages")
      .where("recipient.id", "==", userId)
      .where("deleted", "==", false)
      .orderBy("date", "desc")
      .limit(limit)
      .get();
    messages.forEach((notification) => messagesArr.push(notification.data()));
    return messagesArr;
  };

  const getAllMessages = async (userId) => {
    const messagesArr = [];
    const messages = await firestore
      .collection("messages")
      .where("recipient.id", "==", userId)
      .where("deleted", "==", false)
      .orderBy("date", "desc")
      .get();
    messages.forEach((notification) => messagesArr.push(notification.data()));
    return messagesArr;
  };

  const getUnreadNumber = async (userId) => {
    const messages = await firestore
      .collection("messages")
      .where("recipient.id", "==", userId)
      .where("read", "==", false)
      .get();
    return messages.docs.length;
  };

  const messagesListener = (userId, callback) => {
    return firestore
      .collection("messages")
      .where("recipient.id", "==", userId)
      .onSnapshot(callback);
  };

  return {
    sendMessage,
    readMessages,
    deleteMessage,
    getMessages,
    getAllMessages,
    getSentMessages,
    getUnreadNumber,
    messagesListener,
  };
}

export default useMessage;
