import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import useScroll from "../../hooks/useScroll";
import useComment from "../../hooks/useComment";
import useWindowSize from "../../hooks/useWindowSize";
import Post from "../../components/user/content/Post";
import Sort from "../../components/sort/Sort";
import SortDropdown from "../../components/sort/SortDropdown";

function Posts({ username }) {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("top");
  const { getUserByName, getUserPostsByVotes, getUserPostsByDate } = useUser();
  const { getCommentsNumber } = useComment();
  const postsRef = useRef();
  const { limit } = useScroll(postsRef, 20, 10);
  const { windowSize } = useWindowSize();

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
    <Container>
      {windowSize.width > 992 ? (
        <Sort setSort={setSort} sort={sort} />
      ) : (
        <SortDropdown setSort={setSort} sort={sort} />
      )}
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
    </Container>
  );
}

Posts.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Posts;

const Container = styled.div`
  @media all and (min-width: 992px) {
    grid-row: 2;
    grid-column: 2;
    max-width: 40rem;
  }
  width: 100vw;
`;

const PostList = styled.main`
  & > * {
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
