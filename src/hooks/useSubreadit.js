import firebase from "firebase";
import { firestore } from "../firebase";

function useSubreadit() {
  const createSubreadit = async (name, description, user) => {
    const ref = await firestore.collection("subreadits").add({
      name,
      name_lowercase: name.toLowerCase(),
      description,
      icon: "",
      permissions: {
        owner: [user],
      },
      members: 1,
      date: new Date(),
    });
    ref.update({ id: ref.id });
  };

  const getSubreaditById = (subreaditId) => {
    return firestore.collection("subreadits").doc(subreaditId).get();
  };

  const getSubreaditByName = async (name) => {
    const query = await firestore
      .collection("subreadits")
      .where("name", "==", name)
      .get();
    return query.docs[0].data();
  };

  const deleteSubreadit = (subreaditId) => {
    return firestore.collection("subreadits").doc(subreaditId).delete();
  };

  const getSubreaditPosts = async (subreaditId, limit) => {
    const posts = [];
    const postsDocs = await firestore
      .collection("posts")
      .where("subreadit", "==", subreaditId)
      .limit(limit)
      .get();
    postsDocs.docs.forEach((doc) => posts.push(doc.data()));
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
        members: subreadit.data().members.length,
        id: subreadit.data().id,
        icon: subreadit.data().icon,
      })
    );
    return subreadits;
  };

  // Gets subreadits with most members
  const getPopularSubreadits = async (limit) => {
    const subreadits = [];
    const subreaditsDocs = await firestore
      .collection("subreadits")
      .orderBy("members")
      .limit(limit)
      .get();
    subreaditsDocs.docs.forEach((subreadit) =>
      subreadits.push({
        name: subreadit.data().name,
        members: subreadit.data().members,
        id: subreadit.data().id,
        icon: subreadit.data().icon,
      })
    );
    return subreadits;
  };

  // Add a member to the subreadit members count
  // Add the subreadit to the user's subscriptions.
  const joinSubreadit = (userId, subreadit) => {
    firestore
      .collection("subreadits")
      .doc(subreadit.id)
      .update({
        members: firebase.firestore.FieldValue.increment(1),
      });
    firestore
      .collection("users")
      .doc(userId)
      .collection("subreadits")
      .doc(subreadit.id)
      .set({
        id: subreadit.id,
        name: subreadit.name,
      });
  };

  // Remove a member to the subreadit members count
  // Remove the subreadit from the user's subscriptions.
  const leaveSubreadit = (userId, subreadit) => {
    firestore
      .collection("subreadits")
      .doc(subreadit.id)
      .update({
        members: firebase.firestore.FieldValue.increment(-1),
      });
    firestore
      .collection("users")
      .doc(userId)
      .collection("subreadits")
      .doc(subreadit.id)
      .delete();
  };

  return {
    createSubreadit,
    deleteSubreadit,
    getSubreaditById,
    getSubreaditByName,
    getSubreaditPosts,
    isNameAvailable,
    getSubreadits,
    getPopularSubreadits,
    joinSubreadit,
    leaveSubreadit,
  };
}

export default useSubreadit;
