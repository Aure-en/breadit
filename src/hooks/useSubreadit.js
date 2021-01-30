import { firestore } from "../firebase";

function useSubreadit() {
  const createSubreadit = async (name, description, type) => {
    const ref = await firestore.collection("subreadits").add({
      name,
      description,
      type,
      permissions: [],
      members: 1,
    });
    ref.update({ id: ref.id });
  };

  const deleteSubreadit = (subreaditId) => {
    return firestore.collection("subreadits").doc(subreaditId).delete();
  };

  const getPosts = async (subreaditId) => {
    const posts = [];
    const postsDocs = await firestore
      .collection("posts")
      .where("subreadit", "==", subreaditId);
    postsDocs.forEach((doc) => posts.push(doc.data()));
    return posts;
  };

  return {
    createSubreadit,
    deleteSubreadit,
    getPosts,
  };
}

export default useSubreadit;
