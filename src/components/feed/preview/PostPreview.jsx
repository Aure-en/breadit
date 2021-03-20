/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import redraft from "redraft";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import usePost from "../../../hooks/usePost";
import Carousel from "../../content/shared/Carousel";
import LinkPreview from "./LinkPreview";
import { renderers } from "../../shared/TextEditor";
import Vote from "../../content/shared/Vote";
import Information from "../../content/post/Information";
import Buttons from "../../content/post/Buttons";
import "../../../styles/textEditor.css";

function PostPreview({ postId }) {
  const { currentUser } = useAuth();
  const { getPost } = usePost();
  const [post, setPost] = useState();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    (async () => {
      const post = await getPost(postId);
      setPost(post.data());
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

  const renderImages = (images, title, subreaditName, postId) => {
    return images.length > 1 ? (
      <Link to={`/b/${subreaditName}/${postId}`}>
        <Carousel images={images} title={title} />
      </Link>
    ) : (
      <Link to={`/b/${subreaditName}/${postId}`}>
        <ImageContainer>
          <Image src={images[0]} alt={title} />
        </ImageContainer>
      </Link>
    );
  };

  const renderLink = (link, title, subreaditName, postId) => {
    return (
      <LinkPreview
        link={link}
        title={title}
        subreaditName={subreaditName}
        postId={postId}
      />
    );
  };

  return (
    <>
      {!isHidden && post && (
        <>
          <Container>
            <StyledVote type="posts" docId={postId} user={currentUser} />
            <Main to={`/b/${post.subreadit.name}/${postId}`}>
              <StyledInformation
                subreaditId={post.subreadit.id}
                author={post.author.name}
                date={post.date}
                user={currentUser}
              />
              <Link to={`/b/${post.subreadit.name}`}>
                {post.type !== "link" && (
                  <Link to={`/b/${post.subreadit.name}/${postId}`}>
                    <Title>{post.title}</Title>
                  </Link>
                )}
                <>
                  {post.type === "post" &&
                    post.content &&
                    renderText(post.content, post.subreadit.name, postId)}
                  {post.type === "image" &&
                    renderImages(
                      post.content,
                      post.title,
                      post.subreadit.name,
                      postId
                    )}
                  {post.type === "link" &&
                    renderLink(
                      post.content,
                      post.title,
                      post.subreadit.name,
                      postId
                    )}
                </>
              </Link>
            </Main>
            <StyledButtons
              postId={postId}
              subreadit={post.subreadit.name}
              hide={setIsHidden}
              user={currentUser}
              isPreview
            />
          </Container>
        </>
      )}
    </>
  );
}

PostPreview.propTypes = {
  postId: PropTypes.string.isRequired,
};
export default PostPreview;

const Container = styled.article`
  display: grid;
  grid-template: min-content auto / min-content 1fr;
  border-bottom: 1px solid ${(props) => props.theme.border};
  border-top: 1px solid ${(props) => props.theme.border};
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  background: ${(props) => props.theme.bg_container};
  box-shadow: 0 0 10px -5px ${(props) => props.theme.shadow};

  &:hover {
    border-bottom: 1px solid ${(props) => props.theme.border_active};
    border-top: 1px solid ${(props) => props.theme.border_active};
  }

  @media all and (min-width: 40rem) {
    border-radius: 0.25rem;
    border: 1px solid ${(props) => props.theme.border};

    &:hover {
      border: 1px solid ${(props) => props.theme.border_active};
    }
  }
`;

const Main = styled(Link)`
  grid-row: 1;
  grid-column: 1 / -1;
  flex: 1;

  @media all and (min-width: 768px) {
    grid-column: 2;
  }
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  padding-left: 1rem;
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
  padding: 0 1rem;

  &:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: linear-gradient(
      transparent 5rem,
      ${(props) => props.theme.bg_container}
    );
  }
`;

const StyledVote = styled(Vote)`
  display: flex;
  align-items: center;

  @media all and (min-width: 768px) {
    background: ${(props) => props.theme.vote_bg};
    grid-row: 1 / -1;
    padding: 0.5rem 0.5rem 0 0.5rem;
  }
`;

const StyledButtons = styled(Buttons)`
  @media all and (min-width: 768px) {
    grid-row: 2;
    grid-column: 2 / -1;
  }
  padding-left: 0.25rem;
`;

const StyledInformation = styled(Information)`
  padding-left: 1rem;
  margin-top: 0.5rem;
`;
