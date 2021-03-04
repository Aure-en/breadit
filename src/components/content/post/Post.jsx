/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import redraft from "redraft";
import { useAuth } from "../../../contexts/AuthContext";
import usePost from "../../../hooks/usePost";
import Entry from "../../entry/Entry";
import Carousel from "../shared/Carousel";
import LinkPreview from "../../feed/LinkPreview";
import TextEditor, { renderers } from "../../shared/TextEditor";
import Vote from "../shared/Vote";
import Information from "./Information";
import Buttons from "./Buttons";
import ModifyButtons from "../shared/ModifyButtons";
import "../../../styles/textEditor.css";

function Post({ postId, subreadit }) {
  const { currentUser } = useAuth();
  const { getPost, editPost, deletePost } = usePost();
  const [post, setPost] = useState();
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState("");

  useEffect(() => {
    (async () => {
      const post = await getPost(postId);
      setPost(post.data());
    })();
  }, []);

  const handleEdit = () => {
    editPost(postId, edit);
    setIsEditing(false);
    setPost((prev) => {
      return { ...prev, content: edit };
    });
  };

  // Helper functions to render content depending on its type
  const renderText = (content) => {
    return <Text>{redraft(JSON.parse(content), renderers)}</Text>;
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
      {post && (
        <>
          <Container>
            <Vote type="posts" docId={postId} user={currentUser} />
            <Main>
              {subreadit && (
                <>
                  <StyledInformation
                    subreaditId={post.subreadit.id}
                    author={post.author.name}
                    date={post.date}
                    user={currentUser}
                  />
                  {post.type !== "link" && <Title>{post.title}</Title>}
                  <>
                    {post.type === "post" &&
                      !isEditing &&
                      post.content &&
                      renderText(post.content, subreadit, postId)}
                    {post.type === "image" &&
                      renderImages(post.content, post.title)}
                    {post.type === "link" &&
                      renderLink(post.content, post.title)}
                    {post.type === "post" && isEditing && (
                      <Editor>
                        <TextEditor
                          type="post"
                          sendContent={setEdit}
                          prevContent={post.content}
                        />
                        <Button
                          type="button"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <ButtonFilled type="button" onClick={handleEdit}>
                          Save Changes
                        </ButtonFilled>
                      </Editor>
                    )}
                  </>
                </>
              )}
            </Main>
            <ButtonsContainer>
              <Buttons
                postId={postId}
                subreadit={post.subreadit.name}
                user={currentUser}
              />
              {currentUser && currentUser.uid === post.author.id && (
                <ModifyButtons
                  type={post.type === "post"}
                  onEditClick={() => setIsEditing(!isEditing)}
                  onDeleteClick={() => deletePost(postId)}
                />
              )}
            </ButtonsContainer>
          </Container>

          {isEntryOpen && <Entry close={() => setIsEntryOpen(false)} />}
        </>
      )}
    </>
  );
}

Post.propTypes = {
  postId: PropTypes.string.isRequired,
  subreadit: PropTypes.string.isRequired,
};
export default Post;

const Container = styled.article`
  display: grid;
  border-radius: 0.25rem;
  grid-template: min-content auto / min-content 1fr;
  background: ${(props) => props.theme.backgroundSecondary};
  margin-bottom: 3rem;

  @media all and (min-width: 768px) {
    max-width: 39rem;
    border: 1px solid ${(props) => props.theme.neutral};
    border-radius: 0.25rem;
    margin: 3rem 0;
    padding-right: 1rem;
  }
`;

const Main = styled.div`
  grid-row: 1;
  grid-column: 1 / -1;

  @media all and (min-width: 768px) {
    grid-column: 2;
  }
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  margin-left: 0.5rem;
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
  padding: 0 0.5rem;
`;

const Editor = styled.div`
  position: relative;
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-left: 0.5rem;
  @media all and (min-width: 768px) {
    grid-row: 2;
    grid-column: 1 / -1;
  }
`;

const Button = styled.button`
  display: block;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
  text-align: center;
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.backgroundSecondary};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
`;

const StyledInformation = styled(Information)`
  margin: 0.5rem 0 0 0.5rem;
`;