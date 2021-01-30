import { firestore } from "../firebase";

function useUser() {
  // Create the user's firestore document
  const createUser = (userId, username) => {
    return firestore.collection("users").doc(userId).set({
      username,
      avatar: "",
      karma: 0,
    });
  };

  const getUser = async (userId) => {
    const user = await firestore.collection("users").doc(userId).get();
    return user.data();
  };

  return {
    createUser,
    getUser,
  };
}

export default useUser;
