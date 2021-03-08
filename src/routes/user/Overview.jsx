import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import usePost from "../../hooks/usePost";
import useScroll from "../../hooks/useScroll";
import Post from "../../components/user/content/Post";
import Comment from "../../components/user/content/Comment";

function Overview({ username }) {
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [overview, setOverview] = useState([]);
  const { getUserByName, getUserComments, getUserPosts } = useUser();
  const { getPost } = usePost();
  const docsRef = useRef();
  const { limit } = useScroll(docsRef, 20, 10);

  useEffect(() => {
    (async () => {
      const user = await getUserByName(username);

      // Get comments
      let userComments = await getUserComments(user.id, limit);
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

      // Get posts
      const posts = await getUserPosts(user.id, limit);
      setPosts(posts);
    })();
  }, [limit]);

  // Get overview by combining and sorting posts and comments
  useEffect(() => {
    setOverview(() => {
      return [...comments]
        .map((comment) => {
          return { ...comment, doc: "comment" };
        })
        .concat(
          [...posts].map((post) => {
            return { ...post, doc: "post" };
          })
        )
        .sort((a, b) => b.date.seconds - a.date.seconds);
    });
  }, [comments, posts]);

  return (
    <List ref={docsRef}>
      {overview.map((article) => {
        return article.doc === "post" ? (
          <Post
            key={article.id}
            author={article.author}
            id={article.id}
            subreadit={article.subreadit}
            type={article.type}
            title={article.title}
            content={article.content}
            date={article.date}
          />
        ) : (
          <Comment
            key={article.id}
            id={article.id}
            author={article.author}
            content={article.content}
            date={article.date}
            post={article.post}
          />
        );
      })}
    </List>
  );
}

Overview.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Overview;

const List = styled.div`
  margin-top: 0.5rem;
  width: 100vw;
  max-width: 100%;

  & > * {
    display: block;
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  @media all and (min-width: 992px) {
    margin-top: 0;
  }
`;
