import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/AuthContext";
import usePost from "../../hooks/usePost";
import useComment from "../../hooks/useComment";
import PostContent from "../../components/posts/Post";
import TextEditor from "../../components/TextEditor";
import Comment from "../../components/posts/Comment";
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
  }, []);

  return (
    <div>
      {post && <PostContent postId={postId} subreadit={subreadit} />}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createComment(postId, currentUser, comment);
          textEditorRef.current.reset();
        }}
      >
        <TextEditor
          type="comment"
          sendContent={setComment}
          ref={textEditorRef}
        />
        <button type="submit">Comment</button>
      </form>

      <div>
        <SortDropdown setSort={setSort} sort={sort} />
        {comments &&
          comments.map((commentId) => {
            return (
              <Comment key={commentId} commentId={commentId} postId={postId} />
            );
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