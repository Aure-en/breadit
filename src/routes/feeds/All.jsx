import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import usePost from "../../hooks/usePost";
import useScroll from "../../hooks/useScroll";
import useWindowSize from "../../hooks/useWindowSize";
import PostPreview from "../../components/feed/PostPreview";
import TopSubreadits from "../../components/aside/Top";
import Create from "../../components/aside/Create";
import LatestPosts from "../../components/aside/LatestPosts";
import Footer from "../../components/aside/Footer";
import Sort from "../../components/sort/Sort";

function All() {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("top");
  const { getPostsByVotes, getPostsByDate } = usePost();
  const { windowSize } = useWindowSize();
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
    <>
      <Container>
        <Sort setSort={setSort} sort={sort} />
        <PostsList ref={postsRef}>
          {posts.map((post) => {
            return <PostPreview key={post} postId={post} />;
          })}
        </PostsList>
      </Container>
      {windowSize.width > 768 && (
        <Aside>
          <TopSubreadits />
          <Create />
          <LatestPosts />
          <Footer />
        </Aside>
      )}
    </>
  );
}

export default All;

const Container = styled.div`
  max-width: 40rem;
  flex: 1;
`;

const PostsList = styled.div`
  & > * {
    margin-bottom: 1rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

const Aside = styled.aside`
  max-width: 20rem;
  margin-left: 3rem;

  & > * {
    margin-bottom: 1.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
