import { firestore } from "../firebase";

function useDraft() {
  const createDraft = async (author, subreadit, title, type, content) => {
    const ref = await firestore.collection("drafts").doc();
    const data = {
      author: {
        id: author.uid,
        name: author.displayName,
      },
      type,
      title,
      content,
      date: new Date(),
      subreadit: {
        id: subreadit.id,
        name: subreadit.name,
      },
      id: ref.id,
    };
    ref.set(data);
    return ref.id;
  };

  const editDraft = (id, subreadit, title, type, content) => {
    return firestore.collection("drafts").doc(id).update({
      subreadit,
      title,
      type,
      content,
      date: new Date(),
    });
  };

  const deleteDraft = (id) => {
    return firestore.collection("drafts").doc(id).delete();
  };

  const getDrafts = async (userId) => {
    const drafts = [];
    const query = await firestore
      .collection("drafts")
      .where("author.id", "==", userId)
      .get();
    query.forEach((doc) => drafts.push(doc.data()));
    return drafts;
  };

  const draftsListener = async (userId, callback) => {
    return firestore
      .collection("drafts")
      .where("author.id", "==", userId)
      .onSnapshot(callback);
  };

  return {
    createDraft,
    editDraft,
    getDrafts,
    deleteDraft,
    draftsListener,
  };
}

export default useDraft;
