import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import useScroll from "../../hooks/useScroll";
import useComment from "../../hooks/useComment";
import Post from "../../components/user/content/Post";
import Sort from "../../components/sort/Sort";

function Posts({ username }) {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("top");
  const { getUserByName, getUserPostsByVotes, getUserPostsByDate } = useUser();
  const { getCommentsNumber } = useComment();
  const postsRef = useRef();
  const { limit } = useScroll(postsRef, 20, 10);

  useEffect(() => {
    (async () => {
      const user = await getUserByName(username);
      let posts;
      if (sort === "top") {
        posts = await getUserPostsByVotes(user.id, limit);
      } else {
        posts = await getUserPostsByDate(user.id, limit);
      }

      posts = await Promise.all(
        posts.map(async (post) => {
          const comments = await getCommentsNumber(post.id);
          return { ...post, comments };
        })
      );
      setPosts(posts);
    })();
  }, [sort, limit]);

  return (
    <>
      <Sort setSort={setSort} sort={sort} />
      <PostList ref={postsRef}>
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
    </>
  );
}

Posts.propTypes = {
  username: PropTypes.string.isRequired,
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
