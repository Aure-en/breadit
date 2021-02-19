import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import usePost from "../../hooks/usePost";
import useComment from "../../hooks/useComment";
import Post from "../../components/user/Post";
import Comment from "../../components/user/Comment";

function Overview({ userId }) {
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [overview, setOverview] = useState([]);
  const [limit, setLimit] = useState(20);
  const { getUserComments, getUserPosts } = useUser();
  const { getCommentsNumber } = useComment();
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

  // Get posts
  useEffect(() => {
    (async () => {
      let posts = await getUserPosts(userId, limit);
      posts = await Promise.all(
        posts.map(async (post) => {
          const comments = await getCommentsNumber(post.id);
          return { ...post, comments };
        })
      );
      setPosts(posts);
    })();
  }, [limit]);

  // Get overview by combining and sorting posts and comments
  useEffect(() => {
    setOverview(() => {
      return [...comments]
        .map((comment) => {
          return { ...comment, type: "comment" };
        })
        .concat(
          [...posts].map((post) => {
            return { ...post, type: "post" };
          })
        )
        .sort((a, b) => b.date.seconds - a.date.seconds);
    });
  }, [comments, posts]);

  return (
    <List>
      {overview.map((article) => {
        return article.type === "post" ? (
          <Post
            key={article.id}
            author={article.author}
            id={article.id}
            subreadit={article.subreadit}
            type={article.type}
            title={article.title}
            content={article.content}
            date={article.date}
            comments={article.comments}
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
  userId: PropTypes.string.isRequired,
};

export default Overview;

const List = styled.div`
  & > * {
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
