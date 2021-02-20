import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import usePost from "../hooks/usePost";
import useComment from "../hooks/useComment";
import PostContent from "../components/posts/Post";
import TextEditor from "../components/TextEditor";
import Comment from "../components/posts/Comment";
import SortDropdown from "../components/sort/SortDropdown";

function Post({ match }) {
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState("top");
  const { getPost } = usePost();
  const { createComment, getCommentsByVotes, getCommentsByDate } = useComment();
  const { currentUser } = useAuth();
  const { postId, subreadit } = match.params;

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
      let comments;
      if (sort === "top") {
        comments = await getCommentsByVotes(postId, limit);
      } else {
        comments = await getCommentsByDate(postId, limit);
      }
      setComments(comments);
    })();
  }, [limit, sort]);

  return (
    <div>
      {post && <PostContent postId={post.id} subreadit={subreadit} />}

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
        <SortDropdown setSort={setSort} sort={sort} />
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
      subreadit: PropTypes.string,
    }),
  }).isRequired,
};

export default Post;
