import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useScroll from "../../hooks/useScroll";
import useSubreadit from "../../hooks/useSubreadit";
import useWindowSize from "../../hooks/useWindowSize";
import PostPreview from "../../components/feed/preview/PostPreview";
import Sort from "../../components/sort/Sort";
import SortDropdown from "../../components/sort/SortDropdown";
import About from "../../components/subreadit/aside/About";
import Rules from "../../components/subreadit/aside/Rules";
import Create from "../../components/subreadit/Create";

function Posts({ subreaditName }) {
  const [subreadit, setSubreadit] = useState();
  const [sort, setSort] = useState("top");
  const [posts, setPosts] = useState();
  const {
    getSubreaditByName,
    getSubreaditPostsByVotes,
    getSubreaditPostsByDate,
  } = useSubreadit();
  const postsRef = useRef();
  const { limit } = useScroll(postsRef, 10, 5);
  const { windowSize } = useWindowSize();

  useEffect(() => {
    (async () => {
      const subreadit = await getSubreaditByName(subreaditName);
      setSubreadit(subreadit);
    })();
  }, [subreaditName]);

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
    <Content>
      <Main>
        {windowSize.width > 992 ? (
          <>
            {subreadit && <Create subreadit={subreadit} />}
            <Sort setSort={setSort} sort={sort} />
          </>
        ) : (
          <SortDropdown setSort={setSort} sort={sort} />
        )}
        {posts && (
          <>
            {posts.length > 0 ? (
              <PostsList ref={postsRef}>
                {posts.map((post) => {
                  return <PostPreview key={post.id} postId={post.id} />;
                })}
              </PostsList>
            ) : (
              <Empty>
                <h4>Nothing to see here.</h4>
                There are no posts in b/
                {subreadit.name}{" "}
              </Empty>
            )}
          </>
        )}
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
              {subreadit.rules.length > 0 && (
                <Rules rules={subreadit.rules} subreaditName={subreaditName} />
              )}
            </>
          )}
        </Aside>
      )}
    </Content>
  );
}

export default Posts;

Posts.propTypes = {
  subreaditName: PropTypes.string.isRequired,
};

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;

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
  width: 20rem;
  margin-left: 2rem;

  & > * {
    margin-bottom: 2rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

const Empty = styled.div`
  margin-top: 0.5rem;
  width: 100vw;
  max-width: 100%;
  background: ${(props) => props.theme.backgroundSecondary};
  border-bottom: 1px solid ${(props) => props.theme.border};
  border-top: 1px solid ${(props) => props.theme.border};
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  padding: 1rem;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media all and (min-width: 768px) {
    border: 1px solid ${(props) => props.theme.border};
    align-items: center;
    max-width: 40rem;
  }
`;
