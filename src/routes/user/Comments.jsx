import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import usePost from "../../hooks/usePost";
import useScroll from "../../hooks/useScroll";
import useWindowSize from "../../hooks/useWindowSize";
import Comment from "../../components/user/content/Comment";
import SortDropdown from "../../components/sort/SortDropdown";
import Sort from "../../components/sort/Sort";

function Comments({ username }) {
  const [comments, setComments] = useState([]);
  const [sort, setSort] = useState("top");
  const {
    getUserByName,
    getUserCommentsByVotes,
    getUserCommentsByDate,
  } = useUser();
  const { getPost } = usePost();
  const commentsRef = useRef();
  const { limit } = useScroll(commentsRef, 20, 10);
  const { windowSize } = useWindowSize();

  // Get comments
  useEffect(() => {
    (async () => {
      const user = await getUserByName(username);
      let userComments;
      if (sort === "top") {
        userComments = await getUserCommentsByVotes(user.id, limit);
      } else {
        userComments = await getUserCommentsByDate(user.id, limit);
      }

      userComments = await Promise.all(
        userComments.map(async (comment) => {
          const post = await getPost(comment.post.id);
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
  }, [limit, sort]);

  return (
    <Container>
            {windowSize.width > 992 ? (
        <Sort setSort={setSort} sort={sort} />
      ) : (
        <SortDropdown setSort={setSort} sort={sort} />
      )}
      <CommentsList ref={commentsRef}>
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
    </Container>
  );
}

Comments.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Comments;

const Container = styled.div`
  max-width: 100%;
  width: 100vw;

  @media all and (min-width: 992px) {
    grid-row: 2;
    grid-column: 2;
    max-width: 40rem;
  }
`;

const CommentsList = styled.main`
  & > * {
    display: block;
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
