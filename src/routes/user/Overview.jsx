import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import usePost from "../../hooks/usePost";
import useScroll from "../../hooks/useScroll";
import Post from "../../components/user/content/Post";
import Comment from "../../components/user/content/Comment";

function Overview({ username }) {
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [overview, setOverview] = useState();
  const { getUserByName, getUserComments, getUserPosts } = useUser();
  const { getPost } = usePost();
  const docsRef = useRef();
  const { limit } = useScroll(docsRef, 20, 10);

  useEffect(() => {
    (async () => {
      const user = await getUserByName(username);

      // Get comments
      let userComments = await getUserComments(user.id, limit);
      userComments = await Promise.all(
        userComments.map(async (comment) => {
          const post = await getPost(comment.post.id);
          return {
            ...comment,
            post: {
              id: post.data().id,
              author: post.data().author,
              subreadit: post.data().subreadit,
              title: post.data().title,
            },
          };
        })
      );
      userComments = userComments.map((comment) => {
        const votes = Object.keys(comment.votes).reduce(
          (sum, current) => sum + current,
          0
        );
        return { ...comment, votes };
      });
      setComments(userComments);

      // Get posts
      const posts = await getUserPosts(user.id, limit);
      setPosts(posts);
    })();
  }, [limit, username]);

  // Get overview by combining and sorting posts and comments
  useEffect(() => {
    setOverview(() => {
      return [...comments]
        .map((comment) => {
          return { ...comment, doc: "comment" };
        })
        .concat(
          [...posts].map((post) => {
            return { ...post, doc: "post" };
          })
        )
        .sort((a, b) => b.date.seconds - a.date.seconds);
    });
  }, [comments, posts]);

  return (
    <>
      {overview && (
        <>
          {overview.length > 0 ? (
            <List ref={docsRef}>
              {overview.map((article) => {
                return article.doc === "post" ? (
                  <Post
                    key={article.id}
                    author={article.author}
                    id={article.id}
                    subreadit={article.subreadit}
                    type={article.type}
                    title={article.title}
                    content={article.content}
                    date={article.date}
                  />
                ) : (
                  <Comment
                    key={article.id}
                    id={article.id}
                    author={article.author}
                    content={article.content}
                    date={article.date}
                    post={article.post}
                  />
                );
              })}
            </List>
          ) : (
            <Empty>
              <h4>Nothing to see here.</h4>
              {username} hasn't shared anything yet.
            </Empty>
          )}
        </>
      )}
    </>
  );
}

Overview.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Overview;

const List = styled.main`
  margin-top: 0.5rem;
  width: 100vw;
  max-width: 100%;

  & > * {
    display: block;
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  @media all and (min-width: 992px) {
    margin-top: 0;
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
    border: 1px solid ${(props) => props.theme.neutral};
    align-items: center;
    margin: 1rem;
    max-width: 40rem;
  }
`;
