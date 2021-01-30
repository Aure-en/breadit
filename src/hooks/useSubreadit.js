import { firestore } from "../firebase";

function useSubreadit() {
  const createSubreadit = async (name, description) => {
    const ref = await firestore.collection("subreadits").add({
      name,
      description,
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

  // Check if name is available
  const isNameAvailable = async (name) => {
    const query = await firestore
      .collection("subreadits")
      .where("name", "==", name)
      .get();
    return query.docs.length === 0;
  };

  return {
    createSubreadit,
    deleteSubreadit,
    getPosts,
    isNameAvailable,
  };
}

export default useSubreadit;
