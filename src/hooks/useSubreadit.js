import firebase from "firebase";
import { firestore } from "../firebase";
import { SUBREADIT_ICON, SUBREADIT_BANNER } from "../utils/const";

function useSubreadit() {
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
  const createSubreadit = async (name, description, user) => {
    const ref = await firestore.collection("subreadits").doc();
    await ref.set({
      name: name.toLowerCase(),
      name_sensitive: name,
      description,
      icon: SUBREADIT_ICON,
      banner: SUBREADIT_BANNER,
      permissions: {
        delete: [user.uid],
        settings: [user.uid],
      },
      owner: {
        id: user.uid,
        name: user.displayName,
      },
      members: 0,
      date: new Date(),
      rules: [],
      id: ref.id,
    });
    joinSubreadit(user.uid, {
      id: ref.id,
      name,
    });
  };

  const getSubreaditById = (subreaditId) => {
    return firestore.collection("subreadits").doc(subreaditId).get();
  };

  const getSubreaditByName = async (name) => {
    const query = await firestore
      .collection("subreadits")
      .where("name", "==", name.toLowerCase())
      .get();
    return query.docs.length > 0 ? query.docs[0].data() : undefined;
  };

  const deleteSubreadit = (subreaditId) => {
    return firestore.collection("subreadits").doc(subreaditId).delete();
  };

  const getSubreaditPosts = async (subreaditId, limit) => {
    const posts = [];
    const postsDocs = await firestore
      .collection("posts")
      .where("subreadit.id", "==", subreaditId)
      .limit(limit)
      .get();
    postsDocs.docs.forEach((doc) => posts.push(doc.data()));
    return posts;
  };

  const getSubreaditPostsByVotes = async (subreaditId, limit) => {
    const posts = [];
    const postsDocs = await firestore
      .collection("posts")
      .where("subreadit.id", "==", subreaditId)
      .orderBy("votes.sum", "desc")
      .limit(limit)
      .get();
    postsDocs.docs.forEach((doc) => posts.push(doc.data()));
    return posts;
  };

  const getSubreaditPostsByDate = async (subreaditId, limit) => {
    const posts = [];
    const postsDocs = await firestore
      .collection("posts")
      .where("subreadit.id", "==", subreaditId)
      .orderBy("date", "desc")
      .limit(limit)
      .get();
    postsDocs.docs.forEach((doc) => posts.push(doc.data()));
    return posts;
  };

  // Check if name is available
  const isNameAvailable = async (name) => {
    const query = await firestore
      .collection("subreadits")
      .where("name", "==", name.toLowerCase())
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
      .orderBy("members", "desc")
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

  return {
    createSubreadit,
    deleteSubreadit,
    getSubreaditById,
    getSubreaditByName,
    getSubreaditPosts,
    getSubreaditPostsByVotes,
    getSubreaditPostsByDate,
    isNameAvailable,
    getSubreadits,
    getPopularSubreadits,
    joinSubreadit,
    leaveSubreadit,
  };
}

export default useSubreadit;
