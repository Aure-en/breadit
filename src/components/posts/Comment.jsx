/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import redraft from "redraft";
import useComment from "../../hooks/useComment";
import useVote from "../../hooks/useVote";
import Entry from "../entry/Entry";
import TextEditor, { renderers } from "../TextEditor";
import { useAuth } from "../../contexts/AuthContext";

// Icons
import { ReactComponent as IconUp } from "../../assets/icons/general/icon-upvote.svg";
import { ReactComponent as IconDown } from "../../assets/icons/general/icon-downvote.svg";

function Comment({ commentId }) {
  const [comment, setComment] = useState();
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState("");
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const { currentUser } = useAuth();
  const {
    getComment,
    createComment,
    editComment,
    nestedCommentListener,
  } = useComment();

  // Get the comment's data from the Firestore.
  useEffect(() => {
    (async () => {
      const comment = await getComment(commentId);
      setComment(comment.data());
    })();
  }, []);

  // Listen to the comment:
  // - When the user replies to the comment, its children are updated.
  // - The listener then fetches the new comment (with updated children)
  // and updates the comment state, which triggers a rerender.
  useEffect(() => {
    const unsubscribe = nestedCommentListener(commentId, (snapshot) => {
      setComment(snapshot.data());
    });
    return unsubscribe;
  }, []);

  const { vote, votes, handleUpvote, handleDownvote } = useVote(
    "comments",
    commentId,
    currentUser && currentUser.uid
  );

  const handleEdit = () => {
    editComment(commentId, edit);
    setIsEditing(false);
  };

  return (
    <>
      {comment && (
        <>
          <Container>
            <div>{comment.author.name}</div>

            {isEditing ? (
              <>
                <TextEditor
                  type="comment"
                  sendContent={setEdit}
                  prevContent={comment.content}
                />
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="button" onClick={handleEdit}>
                  Edit
                </button>
              </>
            ) : (
              <>
                <div>{redraft(JSON.parse(comment.content), renderers)}</div>
                <Buttons>
                  <Vote
                    type="button"
                    active={vote === 1}
                    onClick={() => {
                      // eslint-disable-next-line no-unused-expressions
                      currentUser
                        ? handleUpvote(
                            "comments",
                            commentId,
                            currentUser.uid,
                            vote
                          )
                        : setIsEntryOpen(true);
                    }}
                  >
                    <IconUp />
                  </Vote>
                  <span>{votes}</span>
                  <Vote
                    type="button"
                    active={vote === -1}
                    onClick={() => {
                      // eslint-disable-next-line no-unused-expressions
                      currentUser
                        ? handleDownvote(
                            "comments",
                            commentId,
                            currentUser.uid,
                            vote
                          )
                        : setIsEntryOpen(true);
                    }}
                  >
                    <IconDown />
                  </Vote>
                  <button
                    type="button"
                    onClick={() => setIsReplying(!isReplying)}
                  >
                    Reply
                  </button>
                  <button type="button">Save</button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    Edit
                  </button>
                </Buttons>

                {isReplying && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      createComment(commentId, currentUser, reply, commentId);
                      setIsReplying(false);
                    }}
                  >
                    <TextEditor type="comment" sendContent={setReply} />
                    <button type="submit">Comment</button>
                  </form>
                )}
              </>
            )}

            {comment.children.map((childId) => {
              return <Comment key={childId} commentId={childId} />;
            })}
          </Container>
          {isEntryOpen && <Entry close={() => setIsEntryOpen(false)} />}
        </>
      )}
    </>
  );
}

Comment.propTypes = {
  commentId: PropTypes.string.isRequired,
};

export default Comment;

const Container = styled.div`
  & > * {
    margin-left: 1rem;
  }
`;

const Vote = styled.button`
  color: ${(props) => (props.active ? "red" : "black")};
`;

const Buttons = styled.div``;
