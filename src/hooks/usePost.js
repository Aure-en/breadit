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
      upvotes: 0,
      downvotes: 0,
      comments: 0,
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

  const getComments = async (postId) => {
    return firestore
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .get();
  };

  return {
    createPost,
    deletePost,
    getPost,
    getComments,
  };
}

export default usePost;
