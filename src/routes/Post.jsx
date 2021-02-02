import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import usePost from "../hooks/usePost";
import useComment from "../hooks/useComment";
import PostPreview from "../components/posts/PostPreview";
import Comment from "../components/posts/Comment";

function Post({ match }) {
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const { getPost } = usePost();
  const { createComment, getComments } = useComment();
  const { currentUser } = useAuth();
  const postId = match.params.id;

  // Loads the post itself
  useEffect(() => {
    (async () => {
      const post = await getPost(postId);
      setPost(post.data());
    })();
  }, []);

  // Loads the comments
  useEffect(() => {
    (async () => {
      const comments = await getComments(postId);
      setComments(comments);
    })();
  }, []);

  return (
    <div>
      {post && (
        <PostPreview
          subreadit={post.subreadit}
          author={post.author.name}
          date="2/2"
          content={post.content}
        />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createComment(postId, currentUser, comment);
        }}
      >
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What are your throughts?"
        />
        <button type="submit">Comment</button>
      </form>

      <div>
        {comments.map((commentId) => {
          return <Comment key={commentId} commentId={commentId} />;
        })}
      </div>
    </div>
  );
}

Post.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default Post;
