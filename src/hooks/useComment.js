import { firestore } from "../firebase";

function useComment() {
  const createComment = async (postId, author, text, parentId = null) => {
    const ref = await firestore
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .add({
        author: {
          id: author.id,
          name: author.name,
        },
        text,
        date: new Date(),
        upvotes: 0,
        downvotes: 0,
        parent: parentId,
        edited: false,
      });
    ref.update({ id: ref.id });

    // If our comment is a reply to another comment:
    // Update the parent document to add the new comment to their children.
    if (parentId) {
      firestore
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(parentId)
        .collection("children")
        .doc(ref.id)
        .set({});
    }
  };

  const deleteComment = async (postId, commentId) => {
    // If our comment was a reply to another comment:
    // Delete the comment from the parent's children.

    const commentsRef = firestore
      .collection("posts")
      .doc(postId)
      .collection("comments");

    const comment = await commentsRef.doc(commentId).get();

    if (comment.data().parent) {
      commentsRef
        .doc(comment.data().parent)
        .collection("children")
        .doc(commentId)
        .delete();
    }

    // Delete the comment itself.
    commentsRef.doc(commentId).delete();
  };

  const editComment = (postId, commentId, update) => {
    return firestore
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .update({
        text: update,
        edited: true,
      });
  };

  return {
    createComment,
    deleteComment,
    editComment,
  };
}

export default useComment;
