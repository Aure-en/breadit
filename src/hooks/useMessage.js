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

  const deleteMessage = (id) => {
    return firestore.collection("messages").doc(id).delete();
  };

  return {
    sendMessage,
    deleteMessage,
  };
}

export default useMessage;
