import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import usePost from "../../hooks/usePost";
import useScroll from "../../hooks/useScroll";
import PostPreview from "../../components/posts/PostPreview";
import TopSubreadits from "../../components/aside/TopSubreadits";
import Create from "../../components/aside/Create";
import LatestPosts from "../../components/aside/LatestPosts";
import Footer from "../../components/aside/Footer";
import Sort from "../../components/sort/Sort";

function All() {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("top");
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
    <Wrapper>
      <Container>
        <Sort setSort={setSort} sort={sort} />
        <PostsList ref={postsRef}>
          {posts.map((post) => {
            return <PostPreview key={post} postId={post} />;
          })}
        </PostsList>
      </Container>
      <Aside>
        <TopSubreadits />
        <Create />
        <LatestPosts />
        <Footer />
      </Aside>
    </Wrapper>
  );
}

export default All;
const colors = {
  background: "rgb(241, 236, 230)",
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  background: ${colors.background};
  padding: 3rem;
  height: 100%;
  flex: 1;
`;

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
