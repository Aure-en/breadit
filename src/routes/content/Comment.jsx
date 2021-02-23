import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import usePost from "../../hooks/usePost";
import useComment from "../../hooks/useComment";
import PostContent from "../../components/posts/Post";
import CommentTree from "../../components/posts/Comment";

function Comment({ match }) {
  const { subreadit, postId, commentId } = match.params;
  const [post, setPost] = useState();
  const [comment, setComment] = useState();
  const { getPost } = usePost();
  const { getComment } = useComment();

  // Load the post itself
  useEffect(() => {
    (async () => {
      const post = await getPost(postId);
      setPost(post.data());
    })();
  }, []);

  // Load the comment
  useEffect(() => {
    (async () => {
      const comment = await getComment(commentId);
      setComment(comment.data());
    })();
  }, []);

  return (
    <Container>
      {post && <PostContent postId={postId} subreadit={subreadit} />}
      <Link to={`/b/${subreadit}/${postId}`}>View all comments</Link>
      {comment && <CommentTree commentId={commentId} />}
    </Container>
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

const Container = styled.div``;
