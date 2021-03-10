import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import usePost from "../../hooks/usePost";
import useScroll from "../../hooks/useScroll";
import PostPreview from "./preview/PostPreview";

function All({ sort }) {
  const [posts, setPosts] = useState([]);
  const { getPostsByVotes, getPostsByDate } = usePost();
  const postsRef = useRef();
  const { limit } = useScroll(postsRef, 10, 5);

  useEffect(() => {
    (async () => {
      if (sort === "top") {
        const posts = await getPostsByVotes(limit);
        setPosts(posts);
      } else {
        const posts = await getPostsByDate(limit);
        setPosts(posts);
      }
    })();
  }, [sort, limit]);

  return (
    <PostsList ref={postsRef}>
      {posts.map((post) => {
        return <PostPreview key={post} postId={post} />;
      })}
    </PostsList>
  );
}

export default All;

All.propTypes = {
  sort: PropTypes.string,
};

All.defaultProps = {
  sort: "top",
};

const PostsList = styled.div`
  & > * {
    margin-bottom: 1rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
