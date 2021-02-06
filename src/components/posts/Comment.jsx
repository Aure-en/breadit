import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import ReactHtmlParser from "react-html-parser";
import useComment from "../../hooks/useComment";
import useVote from "../../hooks/useVote";
import Entry from "../entry/Entry";
import TextEditor from "../TextEditor";
import { useAuth } from "../../contexts/AuthContext";
import { ReactComponent as IconUp } from "../../assets/icons/icon-upvote.svg";
import { ReactComponent as IconDown } from "../../assets/icons/icon-downvote.svg";

const Container = styled.div`
  & > * {
    margin-left: 1rem;
  }
`;

const Vote = styled.button`
  color: ${(props) => (props.active ? "red" : "black")};
`;

function Comment({ commentId }) {
  const [comment, setComment] = useState();
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const { currentUser } = useAuth();
  const { getComment, createComment } = useComment();
  const { vote, votes, handleUpvote, handleDownvote } = useVote(
    "comments",
    commentId,
    currentUser && currentUser.uid
  );

  useEffect(() => {
    (async () => {
      const comment = await getComment(commentId);
      setComment(comment.data());
    })();
  }, []);

  return (
    <>
      <Container>
        {comment && (
          <>
            <div>
              <Vote
                type="button"
                active={vote === 1}
                onClick={() => {
                  // eslint-disable-next-line no-unused-expressions
                  currentUser
                    ? handleUpvote("posts", commentId, currentUser.uid, vote)
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
                    ? handleDownvote("posts", commentId, currentUser.uid, vote)
                    : setIsEntryOpen(true);
                }}
              >
                <IconDown />
              </Vote>
            </div>
            <div>
              {comment.author.name}
{" "}
              {ReactHtmlParser(
                stateToHTML(convertFromRaw(JSON.parse(comment.text)))
              )}
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
                <TextEditor type="comment" sendContent={setReply} />
                <button type="submit">Comment</button>
              </form>
            )}
            {comment.children.map((child) => {
              return <Comment key={child} commentId={child} />;
            })}
          </>
        )}
      </Container>
      {isEntryOpen && <Entry close={() => setIsEntryOpen(false)} />}
    </>
  );
}

Comment.propTypes = {
  commentId: PropTypes.string.isRequired,
};

export default Comment;
