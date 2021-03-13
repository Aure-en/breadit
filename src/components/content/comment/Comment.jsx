/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import redraft from "redraft";
import useComment from "../../../hooks/useComment";
import TextEditor, { renderers } from "../../shared/TextEditor";
import { useAuth } from "../../../contexts/AuthContext";
import Vote from "../shared/Vote";
import Information from "./Information";
import Buttons from "./Buttons";
import ExtraButtons from "../shared/Buttons";

function Comment({ className, commentId }) {
  const [comment, setComment] = useState();
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState("");
  const { currentUser } = useAuth();
  const {
    getComment,
    createComment,
    editComment,
    nestedCommentListener,
    deleteComment,
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

  const handleEdit = () => {
    editComment(commentId, edit);
    setIsEditing(false);
  };

  return (
    <>
      {comment && (
        <>
          <Container className={className}>
            <>
              {comment.isDeleted ? (
                <Information
                  author={comment.author}
                  date={comment.date}
                  isDeleted
                />
              ) : (
                <Information author={comment.author} date={comment.date} />
              )}
            </>

            {isEditing ? (
              <Form onSubmit={handleEdit}>
                <TextEditor
                  type="comment"
                  sendContent={setEdit}
                  prevContent={comment.content}
                  placeholder="What are your thoughts?"
                />

                <ButtonsForm>
                  <ButtonFilled type="submit">Edit</ButtonFilled>
                  <Button type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </ButtonsForm>
              </Form>
            ) : (
              <>
                <>
                  {comment.isDeleted ? (
                    <p>[deleted]</p>
                  ) : (
                    <div>{redraft(JSON.parse(comment.content), renderers)}</div>
                  )}
                </>
                <ButtonsGroup>
                  <Vote type="comments" docId={commentId} user={currentUser} />
                  <Buttons
                    user={currentUser}
                    commentId={commentId}
                    postId={comment.post.id}
                    subreadit={comment.post.subreadit.name}
                    onReply={() => setIsReplying(!isReplying)}
                  />
                  <ExtraButtons
                    canEdit={
                      currentUser && currentUser.uid === comment.author.id
                    }
                    canDelete={
                      currentUser && currentUser.uid === comment.author.id
                    }
                    onEdit={() => {
                      setIsEditing(true);
                      setEdit(comment.content);
                    }}
                    onDelete={() => deleteComment(commentId)}
                    copy={`${comment.post.subreadit.name}/${comment.post.id}/${commentId}`}
                    type="comment"
                  />
                </ButtonsGroup>

                {isReplying && (
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      createComment(
                        comment.post,
                        currentUser,
                        reply,
                        commentId
                      );
                      setIsReplying(false);
                    }}
                  >
                    <TextEditor type="comment" sendContent={setReply} />
                    <ButtonsForm>
                      <ButtonFilled type="submit">Comment</ButtonFilled>
                      <Button
                        type="button"
                        onClick={() => setIsReplying(false)}
                      >
                        Cancel
                      </Button>
                    </ButtonsForm>
                  </Form>
                )}
              </>
            )}

            {comment.children.map((childId) => {
              return <Comment key={childId} commentId={childId} />;
            })}
          </Container>
        </>
      )}
    </>
  );
}

Comment.propTypes = {
  commentId: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Comment.defaultProps = {
  className: "",
};

export default Comment;

const Container = styled.div`
  position: relative;
  background: ${(props) => props.theme.bg_container};
  margin: 1rem 0;

  & > * {
    margin-left: 1rem;
    padding: 0 0.5rem;
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0.5rem;
    bottom: 0;
    width: 2px;
    border-radius: 1rem;
    background: ${(props) => props.theme.accent};
    opacity: 0.25;
  }
`;

const ButtonsGroup = styled.div`
  display: flex;
  flex-direction: row-reverse;
  padding-right: 0.5rem;

  @media all and (min-width: 768px) {
    flex-direction: row;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: 1rem 0 1rem 1rem;
`;

const ButtonsForm = styled.div`
  display: flex;
  align-self: flex-end;
  margin-top: 1rem;

  & > button {
    margin-right: 1rem;
  }

  & > button:last-child {
    margin-right: 0;
  }
`;

const Button = styled.button`
  display: block;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
  text-align: center;
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.bg_container};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
`;
