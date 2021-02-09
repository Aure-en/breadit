import { useState, useEffect } from "react";
import firebase from "firebase";
import { firestore } from "../firebase";

function useVote(type, id, userId) {
  const [votes, setVotes] = useState(0); // Number of votes a post / comment has.
  const [vote, setVote] = useState(); // Current user's vote

  // Type is either: post / comment
  // id is the postId / commentId.
  const upvote = (type, id, userId) => {
    return firestore
      .collection(type)
      .doc(id)
      .update({
        [`votes.${userId}`]: 1,
      });
  };

  const downvote = (type, id, userId) => {
    return firestore
      .collection(type)
      .doc(id)
      .update({
        [`votes.${userId}`]: -1,
      });
  };

  const removeVote = (type, id, userId) => {
    return firestore
      .collection(type)
      .doc(id)
      .update({
        [`votes.${userId}`]: firebase.firestore.FieldValue.delete(),
      });
  };

  const getVote = async (type, id, userId) => {
    const doc = await firestore.collection(type).doc(id).get();
    return doc.data().votes[userId];
  };

  const countVotes = async (type, id) => {
    const doc = await firestore.collection(type).doc(id).get();
    if (!doc) return 0;
    return Object.values(doc.data().votes).reduce(
      (sum, current) => sum + current,
      0
    );
  };

  const handleUpvote = async (type, id, userId, vote) => {
    if (!userId) return;
    switch (vote) {
      // User already upvoted the post:
      // - Remove the upvote
      case 1:
        removeVote(type, id, userId);
        setVote(null);
        setVotes((prev) => prev - 1);
        break;

      // User downvoted the post:
      // - Replace the downvote (-1) by an upvote (+1)
      // User hasn't voted yet
      // - Simply adds an upvote.
      case -1:
        upvote(type, id, userId);
        setVote(1);
        setVotes((prev) => prev + 2);
        break;
      default:
        upvote(type, id, userId);
        setVote(1);
        setVotes((prev) => prev + 1);
    }
  };

  const handleDownvote = async (type, id, userId, vote) => {
    if (!userId) return;
    switch (vote) {
      // User already downvoted the post:
      // - Remove the downvote
      case -1:
        removeVote(type, id, userId);
        setVote(null);
        setVotes((prev) => prev + 1);
        break;

      // User upvoted the post:
      // - Replace the upvote (+1) by a downvote (-1)
      // User hasn't voted yet:
      // - Simply adds an upvote.
      case 1:
        downvote(type, id, userId);
        setVote(-1);
        setVotes((prev) => prev - 2);
        break;
      default:
        downvote(type, id, userId);
        setVote(-1);
        setVotes((prev) => prev - 1);
    }
  };

  // Get current number of votes
  useEffect(() => {
    (async () => {
      const currentVotes = await countVotes(type, id);
      setVotes(currentVotes);
    })();
  }, []);

  // Get the user's vote
  useEffect(() => {
    if (!userId) return;
    (async () => {
      const currentVote = await getVote(type, id, userId);
      setVote(currentVote);
    })();
  }, []);

  return {
    vote,
    votes,
    handleUpvote,
    handleDownvote,
    countVotes,
  };
}

export default useVote;
