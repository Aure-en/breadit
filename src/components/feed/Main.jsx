import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useSubscription } from "../../contexts/SubscriptionContext";
import usePost from "../../hooks/usePost";
import useScroll from "../../hooks/useScroll";
import PostPreview from "./preview/PostPreview";
import None from "./None";

function Main({ sort }) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { subscriptions } = useSubscription();
  const {
    getSubscriptionsPostsByVotes,
    getSubscriptionsPostsByDate,
  } = usePost();
  const postsRef = useRef();
  const { limit } = useScroll(postsRef, 10, 5);

  // Loads the subscriptions posts depending on sort / limit.
  useEffect(() => {
    (async () => {
      if (subscriptions.length === 0) {
        setLoading(false);
        return;
      }
      let posts;
      if (sort === "top") {
        posts = await getSubscriptionsPostsByVotes(subscriptions, limit);
      } else {
        posts = await getSubscriptionsPostsByDate(subscriptions, limit);
      }
      setPosts(posts);
      setLoading(false);
    })();
  }, [subscriptions, sort, limit]);

  return (
    <>
      {!loading && (
        <>
          {subscriptions.length !== 0 ? (
            <PostsList ref={postsRef}>
              {posts.map((post) => {
                return <PostPreview key={post} postId={post} />;
              })}
            </PostsList>
          ) : (
            <None />
          )}
        </>
      )}
    </>
  );
}

export default Main;

Main.propTypes = {
  sort: PropTypes.string,
};

Main.defaultProps = {
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
