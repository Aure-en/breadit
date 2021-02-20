import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import usePost from "../../hooks/usePost";
import useUser from "../../hooks/useUser";
import PostPreview from "../../components/posts/PostPreview";
import TopSubreadits from "../../components/aside/TopSubreadits";
import Create from "../../components/aside/Create";
import LatestPosts from "../../components/aside/LatestPosts";
import Footer from "../../components/aside/Footer";
import Sort from "../../components/sort/Sort";

function Main() {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState("top");
  const [subscriptions, setSubscriptions] = useState([]);
  const { currentUser } = useAuth();
  const { getUserSubscriptions } = useUser();
  const { getSubscriptionsPostsByVotes, getSubscriptionsPostsByDate } = usePost();

  // Get the user subscriptions
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const subscriptions = await getUserSubscriptions(currentUser.uid);
      setSubscriptions(subscriptions);
    })();
  }, [currentUser]);

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
    <Wrapper>
      <Container>
        <Sort setSort={setSort} sort={sort} />
        {posts.map((post) => {
          return <PostPreview key={post} postId={post} />;
        })}
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

export default Main;

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
