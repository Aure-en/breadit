import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useScroll from "../../hooks/useScroll";
import useSubreadit from "../../hooks/useSubreadit";
import useWindowSize from "../../hooks/useWindowSize";
import PostPreview from "../../components/feed/PostPreview";
import Sort from "../../components/sort/Sort";
import SortDropdown from "../../components/sort/SortDropdown";
import Nav from "../../components/subreadit/Nav";
import Header from "../../components/subreadit/Header";
import About from "../../components/subreadit/aside/About";
import Rules from "../../components/subreadit/aside/Rules";

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
  const { windowSize } = useWindowSize();

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
    <Container>
      <Header subreaditName={subreaditName} />
      {windowSize.width <= 992 && <Nav subreaditName={subreaditName} />}
      <Content>
        <Main>
          {windowSize.width > 992 ? (
            <Sort setSort={setSort} sort={sort} />
          ) : (
            <SortDropdown setSort={setSort} sort={sort} />
          )}
          <PostsList ref={postsRef}>
            {posts.map((post) => {
              return <PostPreview key={post.id} postId={post.id} />;
            })}
          </PostsList>
        </Main>

        {windowSize.width > 992 && (
          <Aside>
            {subreadit && (
              <>
                <About
                  description={subreadit.description}
                  members={subreadit.members}
                  date={subreadit.date}
                />
                <Rules rules={subreadit.rules} subreaditName={subreaditName} />
              </>
            )}
          </Aside>
        )}
      </Content>
    </Container>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Content = styled.div`
  display: flex;

  @media all and (min-width: 992px) {
    margin: 2rem 0;
  }
`;

const Main = styled.main`
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
  margin-left: 2rem;

  & > * {
    margin-bottom: 2rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
