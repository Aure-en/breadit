import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import useScroll from "../../hooks/useScroll";
import useComment from "../../hooks/useComment";
import useWindowSize from "../../hooks/useWindowSize";
import Post from "../../components/user/content/post/Post";
import Sort from "../../components/sort/Sort";
import SortDropdown from "../../components/sort/SortDropdown";

function Posts({ username }) {
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("top");
  const { getUserByName, getUserPostsByVotes, getUserPostsByDate } = useUser();
  const { getCommentsNumber } = useComment();
  const postsRef = useRef();
  const { limit } = useScroll(postsRef, 20, 10);
  const { windowSize } = useWindowSize();

  useEffect(() => {
    (async () => {
      const user = await getUserByName(username);
      let posts;
      if (sort === "top") {
        posts = await getUserPostsByVotes(user.id, limit);
      } else {
        posts = await getUserPostsByDate(user.id, limit);
      }

      posts = await Promise.all(
        posts.map(async (post) => {
          const comments = await getCommentsNumber(post.id);
          return { ...post, comments };
        })
      );
      setPosts(posts);
      setLoading(false);
    })();
  }, [sort, limit, username]);

  return (
    <>
      {!loading && (
        <>
          {posts && (
            <Container>
              {posts.length > 0 ? (
                <>
                  {windowSize.width > 992 ? (
                    <Sort setSort={setSort} sort={sort} />
                  ) : (
                    <SortDropdown setSort={setSort} sort={sort} />
                  )}
                  <PostList ref={postsRef}>
                    {posts.map((post) => {
                      return (
                        <Post
                          key={post.id}
                          author={post.author}
                          id={post.id}
                          subreadit={post.subreadit}
                          type={post.type}
                          title={post.title}
                          content={post.content}
                          date={post.date}
                          comments={post.comments}
                        />
                      );
                    })}
                  </PostList>
                </>
              ) : (
                <Empty>
                  <h4>Nothing to see here.</h4>
                  {username} hasn't posted anything yet.
                </Empty>
              )}
            </Container>
          )}
        </>
      )}
    </>
  );
}

Posts.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Posts;

const Container = styled.div`
  max-width: 100%;
  width: 100vw;

  @media all and (min-width: 992px) {
    grid-row: 2;
    grid-column: 2;
  }
`;

const Empty = styled.div`
  margin-top: 0.5rem;
  width: 100vw;
  max-width: 100%;
  background: ${(props) => props.theme.bg_container};
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
    margin: 1rem;
    max-width: 40rem;
  }
`;

const PostList = styled.main`
  & > * {
    display: block;
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
