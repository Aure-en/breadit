import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/AuthContext";
import usePost from "../../hooks/usePost";
import useComment from "../../hooks/useComment";
import PostContent from "../../components/content/post/Post";
import Comment from "../../components/content/comment/Comment";
import TextEditor from "../../components/shared/TextEditor";
import SortDropdown from "../../components/sort/SortDropdown";

function Post({ match }) {
  const { postId, subreadit } = match.params;
  const [post, setPost] = useState();
  const [comments, setComments] = useState();
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

  // Load the post itself
  useEffect(() => {
    (async () => {
      const post = await getPost(postId);
      setPost(post.data());
    })();
  }, []);

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
    <div>
      {post && (
        <>
          <PostContent postId={postId} subreadit={subreadit} />

          <Form
            onSubmit={(e) => {
              e.preventDefault();
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
            <Button type="submit">Comment</Button>
          </Form>

          <div>
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
          </div>
        </>
      )}
    </div>
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
`;

const Button = styled.button`
  display: block;
  color: ${(props) => props.theme.backgroundSecondary};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: flex-end;
  text-align: center;
  margin-top: 1rem;
`;
