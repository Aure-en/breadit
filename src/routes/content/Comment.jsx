import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import usePost from "../../hooks/usePost";
import useComment from "../../hooks/useComment";
import PostContent from "../../components/content/post/Post";
import CommentTree from "../../components/content/comment/Comment";
import NonexistentPost from "../../components/content/post/Nonexistent";
import NonexistentComment from "../../components/content/comment/Nonexistent";

function Comment({ match }) {
  const { subreadit, postId, commentId } = match.params;
  const [postLoading, setPostLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(true);
  const [post, setPost] = useState();
  const [comment, setComment] = useState();
  const { getPost } = usePost();
  const { getComment } = useComment();

  // Load the post itself
  useEffect(() => {
    (async () => {
      const post = await getPost(postId);
      setPost(post.data());
      setPostLoading(false);
    })();
  }, [postId]);

  // Load the comment
  useEffect(() => {
    (async () => {
      const comment = await getComment(commentId);
      setComment(comment.data());
      setCommentLoading(false);
    })();
  }, [commentId]);

  return (
    <>
      {!postLoading && (
        <>
          {post ? (
            <Container>
              <PostContent postId={postId} subreadit={subreadit} />
              <ViewLink to={`/b/${subreadit}/${postId}`}>
                View all comments
              </ViewLink>

              {!commentLoading && (
                <>
                  {comment ? (
                    <Comments>
                      {comment && (
                        <StyledComment commentId={commentId} postId={postId} />
                      )}
                    </Comments>
                  ) : (
                    <NonexistentComment />
                  )}
                </>
              )}
            </Container>
          ) : (
            <NonexistentPost />
          )}
        </>
      )}
    </>
  );
}

Comment.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string,
      subreadit: PropTypes.string,
      commentId: PropTypes.string,
    }),
  }).isRequired,
};

export default Comment;

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

const Comments = styled.div`
  width: 100%;
`;

const StyledComment = styled(CommentTree)`
  // Remove the vertical bar for the first comment.
  & > * {
    padding-left: 0 !important;
  }

  &:before {
    content: none !important;
  }
`;

const ViewLink = styled(Link)`
  font-size: 0.825rem;
  color: ${(props) => props.theme.accent};
  align-self: flex-start;

  &:hover {
    text-decoration: underline;
  }
`;
