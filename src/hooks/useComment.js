import firebase from "firebase";
import { firestore } from "../firebase";

function useComment() {
  const createComment = async (postId, author, content, parentId = null) => {
    const ref = await firestore.collection("comments").add({
      author: {
        id: author.uid,
        name: author.displayName,
      },
      content,
      date: new Date(),
      votes: {
        list: {},
        sum: 0,
      },
      parent: parentId,
      children: [],
      post: postId,
    });
    ref.update({ id: ref.id });

    // If our comment is a reply to another comment:
    // Update the parent document to add the new comment to their children.
    if (parentId) {
      firestore
        .collection("comments")
        .doc(parentId)
        .update({
          children: firebase.firestore.FieldValue.arrayUnion(ref.id),
        });
    }
  };

  const deleteComment = async (commentId) => {
    // If our comment was a reply to another comment:
    // Delete the comment from the parent's children.

    const commentsRef = firestore.collection("comments").doc(commentId);
    const comment = await commentsRef.doc(commentId).get();

    if (comment.data().parent) {
      firestore
        .collection("comments")
        .doc(comment.data().parent)
        .update({
          children: firebase.firestore.FieldValue.arrayRemove(commentId),
        });
    }

    // Delete the comment itself.
    commentsRef.doc(commentId).delete();
  };

  const editComment = (commentId, update) => {
    return firestore.collection("comments").doc(commentId).update({
      content: update,
    });
  };

  // Get all the comments of a certain post
  const getComments = async (postId) => {
    const commentsList = [];
    const comments = await firestore
      .collection("comments")
      .where("post", "==", postId)
      .where("parent", "==", null)
      .get();
    comments.forEach((comment) => commentsList.push(comment.data().id));
    return commentsList;
  };

  const getCommentsByVotes = async (postId, limit) => {
    const commentsList = [];
    const comments = await firestore
      .collection("comments")
      .where("post", "==", postId)
      .where("parent", "==", null)
      .orderBy("votes.sum", "desc")
      .limit(limit)
      .get();
    comments.forEach((comment) => commentsList.push(comment.data().id));
    return commentsList;
  };

  const getCommentsByDate = async (postId, limit) => {
    const commentsList = [];
    const comments = await firestore
      .collection("comments")
      .where("post", "==", postId)
      .where("parent", "==", null)
      .orderBy("date", "desc")
      .limit(limit)
      .get();
    comments.forEach((comment) => commentsList.push(comment.data().id));
    return commentsList;
  };

  // Get number of comments of a certain post
  const getCommentsNumber = async (postId) => {
    const comments = await firestore
      .collection("comments")
      .where("post", "==", postId)
      .where("parent", "==", null)
      .get();
    return comments.docs.length;
  };

  // Get a comment from an id
  const getComment = (commentId) => {
    return firestore.collection("comments").doc(commentId).get();
  };

  return {
    createComment,
    deleteComment,
    editComment,
    getComments,
    getCommentsByVotes,
    getCommentsByDate,
    getCommentsNumber,
    getComment,
  };
}

export default useComment;
