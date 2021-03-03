import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useScroll from "../../hooks/useScroll";
import useSubreadit from "../../hooks/useSubreadit";
import PostPreview from "../../components/feed/PostPreview";
import SubreaditInfo from "../../components/aside/SubreaditInfo";
import SubreaditRules from "../../components/aside/SubreaditRules";
import Sort from "../../components/sort/Sort";

function Subreadit({ match }) {
  const [subreadit, setSubreadit] = useState();
  const [sort, setSort] = useState("top");
  const [posts, setPosts] = useState([]);
  const {
    getSubreaditByName,
    getSubreaditPostsByVotes,
    getSubreaditPostsByDate,
  } = useSubreadit();
  const subreaditName = match.params.subreadit;
  const postsRef = useRef();
  const { limit } = useScroll(postsRef, 10, 5);

  useEffect(() => {
    (async () => {
      const subreadit = await getSubreaditByName(subreaditName);
      setSubreadit(subreadit);
    })();
  }, [match]);

  useEffect(() => {
    (async () => {
      if (!subreadit) return;
      if (sort === "top") {
        const posts = await getSubreaditPostsByVotes(subreadit.id, limit);
        setPosts(() => posts);
      } else {
        const posts = await getSubreaditPostsByDate(subreadit.id, limit);
        setPosts(() => posts);
      }
    })();
  }, [subreadit, sort, limit]);

  return (
    <>
      <Container>
        <Sort setSort={setSort} sort={sort} />
        <PostsList ref={postsRef}>
          {posts.map((post) => {
            return <PostPreview key={post.id} postId={post.id} />;
          })}
        </PostsList>
      </Container>
      <Aside>
        {subreadit && (
          <>
            <SubreaditInfo subreaditId={subreadit.id} />
            <SubreaditRules subreaditId={subreadit.id} />
          </>
        )}
      </Aside>
    </>
  );
}

Subreadit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subreadit: PropTypes.string,
    }),
  }).isRequired,
};

export default Subreadit;

const Container = styled.main`
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
`;
