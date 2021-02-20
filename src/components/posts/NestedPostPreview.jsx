/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";
import redraft from "redraft";
import { useAuth } from "../../contexts/AuthContext";
import useSubreadit from "../../hooks/useSubreadit";
import useComment from "../../hooks/useComment";
import usePost from "../../hooks/usePost";
import useVote from "../../hooks/useVote";
import Carousel from "./Carousel";
import LinkPreview from "./LinkPreview";
import { renderers } from "../TextEditor";
import "../../styles/textEditor.css";

function NestedPostPreview({ postId }) {
  const { currentUser } = useAuth();
  const { getSubreaditById } = useSubreadit();
  const { getPost } = usePost();
  const { getCommentsNumber } = useComment();
  const { votes } = useVote("posts", postId, currentUser && currentUser.uid);
  const [post, setPost] = useState();
  const [subreadit, setSubreadit] = useState();
  const [commentsNumber, setCommentsNumber] = useState(0);
  const copyRef = useRef();

  useEffect(() => {
    (async () => {
      const post = await getPost(postId);
      setPost(post.data());
      const subreadit = await getSubreaditById(post.data().subreadit);
      setSubreadit(subreadit.data());
      const comments = await getCommentsNumber(postId);
      setCommentsNumber(comments);
    })();
  }, []);

  // Helper functions to render content depending on its type
  const renderText = (content, subreaditName, postId) => {
    return (
      <Link to={`/b/${subreaditName}/${postId}`}>
        <Text>{redraft(JSON.parse(content), renderers)}</Text>
      </Link>
    );
  };

  const renderImages = (images, title) => {
    return images.length > 1 ? (
      <Carousel images={images} title={title} />
    ) : (
      <ImageContainer>
        <Image src={images[0]} alt={title} />
      </ImageContainer>
    );
  };

  const renderLink = (link, title) => {
    return <LinkPreview link={link} title={title} />;
  };

  return (
    <>
      {post && subreadit && (
        <Link to={`/b/${subreadit.name}/${postId}`}>
          <Container>
            <Informations>
              <Link to={`/b/${subreadit.name}`}>
                <BoldPrimary>
                  b/
                  {subreadit.name}
                </BoldPrimary>
              </Link>
              <span> • Posted by </span>
              <Link to={`/user/${post.author.id}`}>
                u/
                {post.author.name}
              </Link>
{" "}
              <Link to={`/b/${subreadit.name}/${postId}`}>
                {formatDistanceStrict(
                  new Date(post.date.seconds * 1000),
                  new Date()
                )}
{" "}
                ago
              </Link>
            </Informations>
            {post.type !== "link" && (
              <Link to={`/b/${subreadit.name}/${postId}`}>
                <Title>{post.title}</Title>
              </Link>
            )}
            <>
              {post.type === "post" &&
                renderText(post.content, subreadit.name, postId)}
              {post.type === "image" && renderImages(post.content, post.title)}
              {post.type === "link" && renderLink(post.content, post.title)}
            </>
            <Informations>
              <Link to={`/b/${subreadit.name}/${postId}`}>{votes} points</Link>
              <span> • </span>
              <Link to={`/b/${subreadit.name}/${postId}`}>
                {commentsNumber} comments
              </Link>
            </Informations>
          </Container>
        </Link>
      )}
    </>
  );
}

NestedPostPreview.propTypes = {
  postId: PropTypes.string.isRequired,
};
export default NestedPostPreview;

const colors = {
  primary: "black",
  secondary: "grey",
  upvote: "rgb(179, 72, 54, .3)",
  neutral: "rgb(209, 163, 155, .3)",
};

const Container = styled.article`
  border: 1px solid ${colors.neutral};
  border-radius: 0.25rem;
  margin: 1rem 0.5rem;

  &:hover {
    border: 1px solid ${colors.upvote};
  }
`;

const BoldPrimary = styled.div`
  font-weight: 600;
  color: ${colors.primary};
`;

const Informations = styled.div`
  display: flex;
  font-size: 0.75rem;
  color: ${colors.secondary};
  padding: 0.5rem;

  & > * {
    margin-right: 0.25rem;
  }

  & > a:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0 0.5rem 0.5rem 0.5rem;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Image = styled.img`
  max-height: 35rem;
  max-width: 100%;
  object-fit: cover;
`;

const Text = styled.div`
  position: relative;
  max-height: 15rem;
  overflow: hidden;
  padding: 0 0.5rem;

  &:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: linear-gradient(transparent 10rem, white);
  }
`;
