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
  };
}

export default useUser;
