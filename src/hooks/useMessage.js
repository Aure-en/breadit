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
    });
  };

  const readMessages = async (userId) => {
    const query = await firestore
      .collection("messages")
      .where("recipient.id", "==", userId)
      .get();
    query.forEach((doc) => doc.ref.update({ read: true }));
  };

  const deleteMessage = (id) => {
    return firestore.collection("messages").doc(id).delete();
  };

  const getMessages = async (userId) => {
    const messagesArr = [];
    const messages = await firestore
      .collection("messages")
      .where("user.id", "==", userId)
      .get();
    messages.forEach((notification) => messagesArr.push(notification));
    return messagesArr;
  };

  const getMessagesNumber = async (userId) => {
    const messages = await getMessages(userId);
    return messages.length;
  };

  return {
    sendMessage,
    readMessages,
    deleteMessage,
    getMessages,
    getMessagesNumber,
  };
}

export default useMessage;
