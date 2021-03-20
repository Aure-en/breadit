/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import redraft from "redraft";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import usePost from "../../../hooks/usePost";
import useSubreadit from "../../../hooks/useSubreadit";
import Carousel from "../shared/Carousel";
import LinkPreview from "../../feed/preview/LinkPreview";
import TextEditor, { renderers } from "../../shared/TextEditor";
import Vote from "../shared/Vote";
import Information from "./Information";
import Buttons from "./Buttons";
import ExtraButtons from "../shared/Buttons";
import "../../../styles/textEditor.css";

function Post({ postId, subreadit }) {
  const { currentUser } = useAuth();
  const history = useHistory();
  const { getPost, editPost, deletePost } = usePost();
  const { getDeletePermissions } = useSubreadit();
  const [post, setPost] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState("");
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    (async () => {
      const post = await getPost(postId);
      setPost(post.data());
    })();
  }, [postId]);

  // Checks delete permissions:
  // Both the author and subreadit mods can delete the post.
  useEffect(() => {
    (async () => {
      const permissions = await getDeletePermissions(subreadit);
      setPermissions(permissions);
    })();
  }, [post]);

  const handleEdit = () => {
    editPost(postId, edit);
    setIsEditing(false);
    setPost((prev) => {
      return { ...prev, content: edit };
    });
  };

  // Helper functions to render content depending on its type
  const renderText = (content) => {
    return content && <Text>{redraft(JSON.parse(content), renderers)}</Text>;
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
                        <EditorButtons>
                          <Button
                            type="button"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <ButtonFilled type="button" onClick={handleEdit}>
                            Save Changes
                          </ButtonFilled>
                        </EditorButtons>
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
              <ExtraButtons
                // Only the author can edit, and only text posts can be edited
                canEdit={
                  currentUser &&
                  currentUser.uid === post.author.id &&
                  post.type === "post"
                }
                // Author and subreadits mods can delete
                canDelete={
                  currentUser &&
                  (currentUser.uid === post.author.id ||
                    permissions[currentUser.uid])
                }
                onEdit={() => {
                  setIsEditing(true);
                }}
                onDelete={() => {
                  deletePost(postId);
                  history.push(`/b/${subreadit}`);
                }}
                copy={`${subreadit}/${postId}`}
                type="post"
              />
            </ButtonsContainer>
          </Container>
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
  margin-bottom: 1rem;
  width: 100%;

  @media all and (min-width: 768px) {
    width: 100vw;
    max-width: 39rem;
    border-radius: 0.25rem;
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
  display: flex;
  flex-direction: column;
`;

const EditorButtons = styled.div`
  display: flex;
  align-self: flex-end;
  margin-top: 1rem;

  & > button {
    margin-right: 1rem;
  }

  & > button:last-child {
    margin-right: 0;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-left: 0.25rem;

  @media all and (min-width: 768px) {
    grid-row: 2;
    grid-column: 1 / -1;
    margin-left: 1rem;
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
  color: ${(props) => props.theme.bg_container};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
`;

const StyledInformation = styled(Information)`
  margin: 0.5rem 0 0 0.5rem;
`;
