import React, { useState, useEffect } from "react";
import { formatDistanceStrict } from "date-fns";
import { Link } from "react-router-dom";
import styled from "styled-components";
import usePost from "../../hooks/usePost";

// Icons
import { ReactComponent as IconPost } from "../../assets/icons/general/icon-post.svg";
import { ReactComponent as IconLink } from "../../assets/icons/general/icon-link.svg";

// Loads and displays the 5 latest breadit posts.
function Latest() {
  const [posts, setPosts] = useState();
  const { getRecentPosts } = usePost();

  useEffect(() => {
    (async () => {
      const recentPosts = await getRecentPosts(5);
      setPosts(recentPosts);
    })();
  }, []);

  return (
    <Container>
      <Heading>Recent Posts</Heading>
      <PostsList>
        {posts &&
          posts.map((post) => {
            return (
              <Link key={post.id} to={`/b/${post.subreadit.name}/${post.id}`}>
                <Post>
                  <Preview>
                    {post.type === "link" && <IconLink />}
                    {post.type === "post" && <IconPost />}
                    {post.type === "image" && (
                      <Image src={post.content[0]} alt={post.title} />
                    )}
                  </Preview>
                  <Text>
                    <Title title={post.title}>{post.title}</Title>
                    <Informations>
                      {post.votes.sum} point
                      {post.votes.sum !== 1 && post.votes.sum !== -1 && "s"} •{" "}
                      {post.comments} comment{post.comments > 1 && "s"} •{" "}
                      {formatDistanceStrict(
                        new Date(post.date.seconds * 1000),
                        new Date()
                      )}
                    </Informations>
                  </Text>
                </Post>
              </Link>
            );
          })}
      </PostsList>
    </Container>
  );
}

export default Latest;

const Container = styled.div`
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.bg_container};
  box-shadow: 0 0 10px -5px ${(props) => props.theme.shadow};
  line-height: 1.25rem;
  border-radius: 0.25rem;
`;

const Heading = styled.h2`
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const PostsList = styled.ul`
  margin: 0;
  padding: 0;

  & > * {
    display: block;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.border};
  }

  & > *:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const Post = styled.li`
  display: flex;
`;

const Preview = styled.div`
  width: 4rem;
  height: 3rem;
  min-width: 4rem;
  min-height: 3rem;
  border: 1px solid ${(props) => props.theme.text_secondary};
  border-radius: 5px;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const Title = styled.div`
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Informations = styled.div`
  color: ${(props) => props.theme.text_secondary};
  font-size: 0.75rem;
`;
