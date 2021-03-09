import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSubscription } from "../../contexts/SubscriptionContext";
import usePost from "../../hooks/usePost";
import useScroll from "../../hooks/useScroll";
import useWindowSize from "../../hooks/useWindowSize";
import PostPreview from "../../components/feed/PostPreview";
import TopSubreadits from "../../components/aside/Top";
import Create from "../../components/aside/Create";
import Latest from "../../components/aside/Latest";
import Footer from "../../components/aside/Footer";
import Sort from "../../components/sort/Sort";

function Main() {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("top");
  const { subscriptions } = useSubscription();
  const {
    getSubscriptionsPostsByVotes,
    getSubscriptionsPostsByDate,
  } = usePost();
  const { windowSize } = useWindowSize();
  const postsRef = useRef();
  const { limit } = useScroll(postsRef, 10, 5);

  // Loads the subscriptions posts depending on sort / limit.
  useEffect(() => {
    (async () => {
      if (subscriptions.length === 0) return;
      let posts;
      if (sort === "top") {
        posts = await getSubscriptionsPostsByVotes(subscriptions, limit);
      } else {
        posts = await getSubscriptionsPostsByDate(subscriptions, limit);
      }
      setPosts(posts);
    })();
  }, [subscriptions, sort, limit]);

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
      {windowSize.width > 992 && (
        <Aside>
          <TopSubreadits />
          <Create />
          <Latest />
          <Footer />
        </Aside>
      )}
    </>
  );
}

export default Main;

const Container = styled.div`
  max-width: 40rem;
  flex: 1;
  margin: 1rem 0;

  @media all and (min-width: 992px) {
    margin: 3rem 0;
  }
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
  margin: 3rem 0 3rem 3rem;

  & > * {
    margin-bottom: 1.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
