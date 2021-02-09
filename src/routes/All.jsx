import React, { useState, useEffect } from "react";
import styled from "styled-components";
import usePost from "../hooks/usePost";
import PostPreview from "../components/posts/PostPreview";
import "../styles/styles.css";

const Container = styled.div`
  max-width: 40rem;
`;

function All() {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(20);
  const { getPosts } = usePost();

  useEffect(() => {
    (async () => {
      const posts = await getPosts(limit);
      setPosts(posts);
    })();
  }, [limit]);

  return (
    <Container>
      {posts.map((post) => {
        return <PostPreview key={post} postId={post} />;
      })}
    </Container>
  );
}

export default All;
