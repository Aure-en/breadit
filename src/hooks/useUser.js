import { firestore } from "../firebase";

function useUser() {
  // Create the user's firestore document
  const createUser = (userId, username) => {
    return firestore.collection("users").doc(userId).set({
      id: userId,
      username,
      // To check if username is available (no case insensitive search >:)
      username_lowercase: username.toLowerCase(),
      avatar: "",
      banner: "",
      about: "",
      subreadits: [],
      date: new Date(),
    });
  };

  const getUser = async (userId) => {
    const user = await firestore.collection("users").doc(userId).get();
    return user.data();
  };

  const getUserByName = async (username) => {
    let user;
    const query = await firestore
      .collection("users")
      .where("username_lowercase", "==", username.toLowerCase())
      .get();
    query.forEach((doc) => {
      user = doc.data();
    });
    return user;
  };

  const getKarma = async (userId) => {
    let karma = 0;
    const posts = await firestore
      .collection("posts")
      .where("author.id", "==", userId)
      .get();
    posts.docs.forEach((post) => {
      karma += post.data().votes.sum;
    });

    const comments = await firestore
      .collection("comments")
      .where("author.id", "==", userId)
      .get();
    comments.docs.forEach((post) => {
      karma += post.data().votes.sum;
    });
    return karma;
  };

  const isUsernameAvailable = async (name) => {
    const query = await firestore
      .collection("users")
      .where("username_lowercase", "==", name)
      .get();
    return query.docs.length === 0;
  };

  const getUserPosts = async (userId, limit) => {
    const posts = [];
    const query = await firestore
      .collection("posts")
      .where("author.id", "==", userId)
      .limit(limit)
      .get();
    query.docs.forEach((post) => posts.push(post.data()));
    return posts;
  };

  const getUserPostsByVotes = async (userId, limit) => {
    const posts = [];
    const query = await firestore
      .collection("posts")
      .where("author.id", "==", userId)
      .orderBy("votes.sum", "desc")
      .limit(limit)
      .get();
    query.docs.forEach((post) => posts.push(post.data()));
    return posts;
  };

  const getUserPostsByDate = async (userId, limit) => {
    const posts = [];
    const query = await firestore
      .collection("posts")
      .where("author.id", "==", userId)
      .orderBy("date", "desc")
      .limit(limit)
      .get();
    query.docs.forEach((post) => posts.push(post.data()));
    return posts;
  };

  const getUserComments = async (userId, limit) => {
    const comments = [];
    const query = await firestore
      .collection("comments")
      .where("author.id", "==", userId)
      .limit(limit)
      .get();
    query.docs.forEach((comment) => comments.push(comment.data()));
    return comments;
  };

  const getUserCommentsByVotes = async (userId, limit) => {
    const comments = [];
    const query = await firestore
      .collection("comments")
      .where("author.id", "==", userId)
      .orderBy("votes.sum", "desc")
      .limit(limit)
      .get();
    query.docs.forEach((comment) => comments.push(comment.data()));
    return comments;
  };

  const getUserCommentsByDate = async (userId, limit) => {
    const comments = [];
    const query = await firestore
      .collection("comments")
      .where("author.id", "==", userId)
      .orderBy("date", "desc")
      .limit(limit)
      .get();
    query.docs.forEach((comment) => comments.push(comment.data()));
    return comments;
  };

  const getUserSubscriptions = async (userId) => {
    const subreadits = [];
    const query = await firestore
      .collection("users")
      .doc(userId)
      .collection("subreadits")
      .get();
    query.docs.forEach((doc) => subreadits.push(doc.id));
    return subreadits;
  };

  return {
    createUser,
    getUser,
    getUserByName,
    isUsernameAvailable,
    getKarma,
    getUserPosts,
    getUserPostsByVotes,
    getUserPostsByDate,
    getUserComments,
    getUserCommentsByVotes,
    getUserCommentsByDate,
    getUserSubscriptions,
  };
}

export default useUser;
