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

  const getSubreadit = (subreaditId) => {
    return firestore.collection("subreadits").doc(subreaditId).get();
  }

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

  const getSubreadits = async () => {
    const subreadits = [];
    const subreaditsDocs = await firestore.collection("subreadits").get();
    subreaditsDocs.forEach((subreadit) =>
      subreadits.push({
        name: subreadit.data().name,
        members: subreadit.data().members,
        id: subreadit.data().id,
      })
    );
    return subreadits;
  };

  return {
    createSubreadit,
    deleteSubreadit,
    getSubreadit,
    getPosts,
    isNameAvailable,
    getSubreadits,
  };
}

export default useSubreadit;
