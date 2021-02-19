/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import redraft from "redraft";
import useComment from "../../hooks/useComment";
import useVote from "../../hooks/useVote";
import Entry from "../entry/Entry";
import TextEditor from "../TextEditor";
import { useAuth } from "../../contexts/AuthContext";

// Icons
import { ReactComponent as IconUp } from "../../assets/icons/general/icon-upvote.svg";
import { ReactComponent as IconDown } from "../../assets/icons/general/icon-downvote.svg";

const renderers = {
  inline: {
    // The key passed here is just an index based on rendering order inside a block
    BOLD: (children, { key }) => <strong key={key}>{children}</strong>,
    ITALIC: (children, { key }) => <em key={key}>{children}</em>,
    UNDERLINE: (children, { key }) => <u key={key}>{children}</u>,
    CODE: (children, { key }) => (
      <span key={key} className="code">
        {children}
      </span>
    ),
    HEADING: (children, { key }) => (
      <div className="heading" key={key}>
        {children}
      </div>
    ),
    STRIKETHROUGH: (children, { key }) => (
      <span key={key} className="strikethrough">
        {children}
      </span>
    ),
  },
  blocks: {
    unstyled: (children, { key }) =>
      children.map((child) => (
        <div key={key} className="block">
          {child}
        </div>
      )),
    codeBlock: (children, { key }) =>
      children.map((child) => (
        <pre key={key} className="codeBlock">
          {child}
        </pre>
      )),
    quoteBlock: (children, { key }) =>
      children.map((child) => (
        <div key={key} className="quoteBlock">
          {child}
        </div>
      )),
    "unordered-list-item": (children, { keys }) => (
      <ul key={keys[keys.length - 1]}>
        {children.map((child) => (
          <li key={keys[keys.length - 1]}>{child}</li>
        ))}
      </ul>
    ),
    "ordered-list-item": (children, { keys }) => (
      <ol key={keys.join("|")}>
        {children.map((child, index) => (
          <li key={keys[index]}>{child}</li>
        ))}
      </ol>
    ),
  },
};

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
      console.log(comment.data())
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
              {redraft(JSON.parse(comment.content), renderers)}
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

const Container = styled.div`
  & > * {
    margin-left: 1rem;
  }
`;

const Vote = styled.button`
  color: ${(props) => (props.active ? "red" : "black")};
`;
