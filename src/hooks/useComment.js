import firebase from "firebase";
import { firestore } from "../firebase";
import useNotification from "./useNotification";

function useComment() {
  const { createNotification, notifyMention } = useNotification();

  // Get a comment from an id
  const getComment = (commentId) => {
    return firestore.collection("comments").doc(commentId).get();
  };

  const createComment = async (post, author, content, parentId = null) => {
    const ref = await firestore.collection("comments").doc();
    const data = {
      author: {
        id: author.uid,
        name: author.displayName,
      },
      content,
      date: new Date(),
      votes: {
        list: {
          [author.uid]: 1,
        },
        sum: 1,
      },
      parent: parentId,
      children: [],
      post,
      isDeleted: false,
      id: ref.id,
    };
    ref.set(data);

    // If the comment is not a reply to another comment:
    // Notify the post author.
    if (!parentId) {
      if (post.author.id !== author.uid) {
        createNotification(
          // Type
          "comment",
          // User
          {
            id: post.author.id,
            name: post.author.name,
          },
          // Author,
          { id: author.uid, name: author.displayName },
          post,
          // Subreadit
          { id: post.subreadit.id, name: post.subreadit.name },
          // Content
          { type: "comment", content, id: ref.id }
        );
      }
    }

    // If the comment is a reply to another comment:
    if (parentId) {
      // Update the parent document to add the new comment to their children.
      firestore
        .collection("comments")
        .doc(parentId)
        .update({
          children: firebase.firestore.FieldValue.arrayUnion(ref.id),
        });

      // Notify the author of the parent.
      const parent = await getComment(parentId);
      if (parent.data().author.id !== author.uid) {
        createNotification(
          // Type
          "reply",
          // User
          { id: parent.data().author.id, name: parent.data().author.name },
          { id: author.uid, name: author.displayName },
          post,
          // Subreadit
          { id: post.subreadit.id, name: post.subreadit.name },
          // Content
          { type: "comment", content, id: ref.id }
        );
      }
    }

    // Notify mentioned users
    notifyMention(
      // Author
      { id: author.uid, name: author.displayName },
      post,
      // Subreadit
      { id: post.subreadit.id, name: post.subreadit.name },
      // Content informations
      { type: "comment", content, id: ref.id }
    );
  };

  const deleteComment = async (commentId) => {
    // Delete the post from the users' saved posts/comments.
    const saved = await firestore
      .collectionGroup("saved")
      .where("id", "==", commentId)
      .get();
    saved.forEach((doc) => doc.ref.delete());

    // Replace the comment's content and author.
    return firestore
      .collection("comments")
      .doc(commentId)
      .update({
        author: {
          name: "[deleted]",
          id: "[deleted]",
        },
        content: "",
        isDeleted: true,
      });
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
      .where("post.id", "==", postId)
      .where("parent", "==", null)
      .get();
    comments.forEach((comment) => commentsList.push(comment.data().id));
    return commentsList;
  };

  const getCommentsByVotes = async (postId, limit) => {
    const commentsList = [];
    const comments = await firestore
      .collection("comments")
      .where("post.id", "==", postId)
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
      .where("post.id", "==", postId)
      .get();
    return comments.docs.length;
  };

  const commentListener = (postId, callback) => {
    return firestore
      .collection("comments")
      .where("post.id", "==", postId)
      .onSnapshot(callback);
  };

  const nestedCommentListener = (commentId, callback) => {
    return firestore.collection("comments").doc(commentId).onSnapshot(callback);
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
    commentListener,
    nestedCommentListener,
  };
}

export default useComment;
