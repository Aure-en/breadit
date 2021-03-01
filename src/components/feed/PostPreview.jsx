/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import redraft from "redraft";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSave } from "../../contexts/SaveContext";
import useComment from "../../hooks/useComment";
import usePost from "../../hooks/usePost";
import Entry from "../entry/Entry";
import Carousel from "../shared/Carousel";
import LinkPreview from "./LinkPreview";
import { renderers } from "../shared/TextEditor";
import "../../styles/textEditor.css";
import Vote from "../shared/Vote";
import Information from "../content/post/Information";
import Buttons from "../content/post/Buttons";

function PostPreview({ postId }) {
  const { currentUser } = useAuth();
  const { saved, handleSave } = useSave();
  const { getPost } = usePost();
  const { getCommentsNumber } = useComment();
  const [post, setPost] = useState();
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [commentsNumber, setCommentsNumber] = useState(0);
  const copyRef = useRef();

  useEffect(() => {
    (async () => {
      const post = await getPost(postId);
      setPost(post.data());
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

  // Copy the post link
  const copyLink = () => {
    if (!copyRef) return;
    copyRef.current.select();
    copyRef.current.setSelectionRange(0, 99999);
    document.execCommand("copy");
  };

  return (
    <>
      {!isHidden && post && (
        <>
          <Container>
            <Vote type="posts" docId={postId} user={currentUser} />
            <Main to={`/b/${post.subreadit.name}/${postId}`}>
              <Information
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
                    renderImages(post.content, post.title)}
                  {post.type === "link" && renderLink(post.content, post.title)}
                </>
              </Link>
            </Main>
            <ButtonsContainer>
              <Buttons
                postId={postId}
                subreadit={post.subreadit.name}
                hide={setIsHidden}
                user={currentUser}
              />
            </ButtonsContainer>
          </Container>

          {isEntryOpen && <Entry close={() => setIsEntryOpen(false)} />}
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

  border: 1px solid ${(props) => props.theme.neutral};
  border-radius: 0.25rem;
  background: ${(props) => props.theme.backgroundSecondary};

  &:hover {
    border: 1px solid ${(props) => props.theme.borderHover};
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
    background: linear-gradient(transparent 5rem, white);
  }
`;

const ButtonsContainer = styled.div`
  @media all and (min-width: 768px) {
    grid-row: 2;
    grid-column: 1 / -1;
  }
`;