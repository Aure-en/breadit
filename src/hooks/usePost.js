import { firestore } from "../firebase";

function usePost() {
  const createPost = async (
    author,
    subreaditId,
    title,
    type,
    content,
    spoiler
  ) => {
    const ref = await firestore.collection("posts").add({
      author: {
        id: author.uid,
        name: author.displayName,
      },
      type,
      title,
      content,
      date: new Date(),
      votes: {},
      subreadit: subreaditId,
      spoiler,
    });
    ref.update({ id: ref.id });
    return ref.id;
  };

  const deletePost = (postId) => {
    // Delete the post id from the subreadit's posts.
    return firestore.collection("posts").doc(postId).delete();
  };

  const getPost = (postId) => {
    return firestore.collection("posts").doc(postId).get();
  };

  const getPosts = async (limit) => {
    const posts = [];
    const postsDocs = await firestore.collection("posts").limit(limit).get();
    postsDocs.docs.forEach((doc) => posts.push(doc.data()));
    return posts;
  };

  return {
    createPost,
    deletePost,
    getPost,
    getPosts,
  };
}

export default usePost;
