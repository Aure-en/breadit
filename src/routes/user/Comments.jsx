import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import usePost from "../../hooks/usePost";
import Comment from "../../components/user/Comment";

function Comments({ userId }) {
  const [comments, setComments] = useState([]);
  const [limit, setLimit] = useState(20);
  const { getUserComments } = useUser();
  const { getPost } = usePost();

  // Get comments
  useEffect(() => {
    (async () => {
      let userComments = await getUserComments(userId, limit);
      userComments = await Promise.all(
        userComments.map(async (comment) => {
          const post = await getPost(comment.post);
          return {
            ...comment,
            post: {
              id: post.data().id,
              author: post.data().author,
              subreadit: post.data().subreadit,
              title: post.data().title,
            },
          };
        })
      );
      userComments = userComments.map((comment) => {
        const votes = Object.keys(comment.votes).reduce(
          (sum, current) => sum + current,
          0
        );
        return { ...comment, votes };
      });
      setComments(userComments);
    })();
  }, [limit]);

  return (
    <CommentsList>
      {comments.map((comment) => {
        return (
          <Comment
            key={comment.id}
            id={comment.id}
            author={comment.author}
            content={comment.content}
            date={comment.date}
            post={comment.post}
          />
        );
      })}
    </CommentsList>
  );
}

Comments.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default Comments;

const CommentsList = styled.div`
  & > * {
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
