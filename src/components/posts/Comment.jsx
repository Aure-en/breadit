import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useComment from "../../hooks/useComment";
import { useAuth } from "../../contexts/AuthContext";

function Comment({ commentId }) {
  const [comment, setComment] = useState();
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const { currentUser } = useAuth();
  const { getComment, createComment } = useComment();

  useEffect(() => {
    (async () => {
      const comment = await getComment(commentId);
      setComment(comment.data());
      console.log(comment.data());
    })();
  }, []);

  return (
    <div>
      {comment && (
        <>
          <div>
            {comment.author.name} {comment.text}
          </div>
          <button type="button" onClick={() => setIsReplying(!isReplying)}>
            Reply
          </button>

          {isReplying && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createComment(comment.id, currentUser, reply, commentId);
              }}
            >
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="What are your throughts?"
              />
              <button type="submit">Comment</button>
            </form>
          )}

          {comment.children.map((child) => {
            return <Comment key={child} commentId={child} />;
          })}
        </>
      )}
    </div>
  );
}

Comment.propTypes = {
  commentId: PropTypes.string.isRequired,
};

export default Comment;
