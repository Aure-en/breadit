import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import useComment from "../../hooks/useComment";
import Post from "../../components/user/Post";

function Posts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(20);
  const { getUserPosts } = useUser();
  const { getCommentsNumber } = useComment();

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

  return (
    <PostList>
      {posts.map((post) => {
        return (
          <Post
            key={post.id}
            author={post.author}
            id={post.id}
            subreadit={post.subreadit}
            type={post.type}
            title={post.title}
            content={post.content}
            date={post.date}
            comments={post.comments}
          />
        );
      })}
    </PostList>
  );
}

Posts.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default Posts;

const PostList = styled.div`
  & > * {
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
