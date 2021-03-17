import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/AuthContext";
import usePost from "../../hooks/usePost";
import useComment from "../../hooks/useComment";
import useLoading from "../../hooks/useLoading";
import PostContent from "../../components/content/post/Post";
import Comment from "../../components/content/comment/Comment";
import Nonexistent from "../../components/content/post/Nonexistent";
import TextEditor from "../../components/shared/TextEditor";
import SortDropdown from "../../components/sort/SortDropdown";

// Icons
import { ReactComponent as IconComment } from "../../assets/icons/general/icon-comment.svg";

function Post({ match }) {
  const { postId, subreadit } = match.params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState("top");
  const { getPost } = usePost();
  const {
    createComment,
    getCommentsByVotes,
    getCommentsByDate,
    commentListener,
  } = useComment();
  const { currentUser } = useAuth();
  const textEditorRef = useRef();
  const postLoading = useLoading(post);
  const commentsLoading = useLoading(comments);

  // Load the post itself
  useEffect(() => {
    (async () => {
      const post = await getPost(postId);
      setPost(post.data());
    })();
  }, [match]);

  // Load the comments
  useEffect(() => {
    (async () => {
      let comments;
      if (sort === "top") {
        comments = await getCommentsByVotes(postId, limit);
      } else {
        comments = await getCommentsByDate(postId, limit);
      }
      setComments(comments);
    })();
  }, [limit, sort]);

  // Listen to comments
  // - When a new comment is added to the post by the user, update comments
  // so that the new comment appears without having to refresh the page.
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = commentListener(postId, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.doc.data().author.id === currentUser.uid) {
          let comments;
          if (sort === "top") {
            comments = await getCommentsByVotes(postId, limit);
          } else {
            comments = await getCommentsByDate(postId, limit);
          }
          setComments(comments);
        }
      });
    });
    return unsubscribe;
  }, [currentUser]);

  return (
    <>
      {!postLoading && (
        <>
          {post ? (
            <Container>
              <PostContent postId={postId} subreadit={subreadit} />

              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!comment) return; // Prevent from writing empty comments
                  createComment(post, currentUser, comment);
                  textEditorRef.current.reset();
                }}
              >
                <Editor>
                  <TextEditor
                    type="comment"
                    sendContent={setComment}
                    ref={textEditorRef}
                    placeholder="What are your thoughts?"
                  />
                </Editor>
                <Button type="submit" disabled={!comment}>Comment</Button>
              </Form>

              <>
                {!commentsLoading && (
                  <>
                    {comments.length === 0 ? (
                      <>
                        <NoComment>
                          <Icon>
                            <IconComment />
                          </Icon>
                          <h4>No comments here yet.</h4>
                          Be the first to share what you think!
                        </NoComment>
                      </>
                    ) : (
                      <Comments>
                        <SortDropdown setSort={setSort} sort={sort} />
                        {comments &&
                          comments.map((commentId) => {
                            return (
                              <StyledComment
                                key={commentId}
                                commentId={commentId}
                                post={post}
                              />
                            );
                          })}
                      </Comments>
                    )}
                  </>
                )}
              </>
            </Container>
          ) : (
            <Nonexistent />
          )}
        </>
      )}
    </>
  );
}

Post.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string,
      subreadit: PropTypes.string,
    }),
  }).isRequired,
};

export default Post;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: flex-start;
  flex: 1;
  border-radius: 5px;
  background: ${(props) => props.theme.bg_container};
  border-bottom: 1px solid ${(props) => props.theme.border};
  border-top: 1px solid ${(props) => props.theme.border};
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;

  @media all and (min-width: 520px) {
    padding: 1rem;
  }

  @media all and (min-width: 768px) {
    border: 1px solid ${(props) => props.theme.border};
    align-items: center;
    margin: 1rem;
    max-width: 40rem;
  }
`;

const Editor = styled.div`
  position: relative;
`;

const StyledComment = styled(Comment)`
  padding: 1rem 0;

  // Remove the vertical bar for the first comment.
  & > * {
    padding-left: 0 !important;
  }

  &:before {
    content: none !important;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media all and (min-width: 360px) {
    padding: 0 1rem;
  }
`;

const Comments = styled.div`
  width: 100%;
`;

const Button = styled.button`
  display: block;
  color: ${(props) => props.theme.bg_container};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: flex-end;
  text-align: center;
  margin-top: 1rem;

  &:disabled {
    background-color: ${(props) => props.theme.accent_disabled};
    border: 1px solid ${(props) => props.theme.accent_disabled};
    cursor: not-allowed;
  }
`;

const NoComment = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Icon = styled.span`
  color: ${(props) => props.theme.accent};
`;
