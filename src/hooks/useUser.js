import { firestore } from "../firebase";

function useUser() {
  // Create the user's firestore document
  const createUser = (userId, username) => {
    return firestore.collection("users").doc(userId).set({
      id: userId,
      username,
      // To check if username is available (no case insensitive search >:)
      username_lowercase: username.toLowerCase(),
      karma: 0,
    });
  };

  const getUser = async (userId) => {
    const user = await firestore.collection("users").doc(userId).get();
    return user.data();
  };

  const getKarma = async (userId) => {
    let karma = 0;
    const posts = await firestore
      .collection("posts")
      .where("author.id", "==", userId)
      .get();
    posts.docs.forEach((post) => {
      karma += Object.values(post.data().votes).reduce(
        (sum, current) => sum + current,
        0
      );
    });
    const comments = await firestore
      .collection("comments")
      .where("author.id", "==", userId)
      .get();
    comments.docs.forEach((post) => {
      karma += Object.values(post.data().votes).reduce(
        (sum, current) => sum + current,
        0
      );
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

  return {
    createUser,
    getUser,
    isUsernameAvailable,
    getKarma,
  };
}

export default useUser;
