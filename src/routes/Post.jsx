import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import usePost from "../hooks/usePost";
import useComment from "../hooks/useComment";
import PostPreview from "../components/posts/PostPreview";
import TextEditor from "../components/TextEditor";
import Comment from "../components/posts/Comment";

function Post({ match }) {
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const { getPost } = usePost();
  const { createComment, getComments } = useComment();
  const { currentUser } = useAuth();
  const { postId } = match.params;

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
      {post && <PostPreview postId={post.id} />}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createComment(postId, currentUser, comment);
        }}
      >
        <TextEditor type="comment" sendContent={setComment} />
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
      postId: PropTypes.string,
    }),
  }).isRequired,
};

export default Post;
