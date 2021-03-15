/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import usePost from "../../hooks/usePost";
import useStorage from "../../hooks/useStorage";
import TextEditor from "../../components/shared/TextEditor";
import Type from "../../components/create/Type";
import Title from "../../components/create/Title";
import Image from "../../components/create/Image";
import Subreadit from "../../components/create/Subreadit";
import Drafts from "../../components/create/drafts/Drafts";
import SaveDraft from "../../components/create/drafts/SaveDraft";
import UpdateDraft from "../../components/create/drafts/UpdateDraft";

function CreatePost({ location }) {
  const [type, setType] = useState("post");
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [post, setPost] = useState("");
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [subreadit, setSubreadit] = useState({ id: "", name: "" });
  const [currentDraft, setCurrentDraft] = useState("");
  const { currentUser } = useAuth();
  const { createPost } = usePost();
  const { uploadImage } = useStorage();
  const history = useHistory();

  // Pre-fill
  useEffect(() => {
    if (location.type) setType(location.type);
    if (location.subreadit) setSubreadit(location.subreadit);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let content;
    switch (type) {
      case "image": {
        // If the user wants to create an image post:
        // Upload the images to the storage and turns them into links.
        const imagesUrls = [];
        await Promise.all(
          images.map(async (file) => {
            const imageUrl = await uploadImage(file);
            imagesUrls.push(imageUrl);
          })
        );
        content = imagesUrls;
        break;
      }

      case "link":
        // Checks if the link is valid.
        if (
          !/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
            link
          )
        ) {
          setLinkError("This link doesn't seem to be valid.");
          return;
        }
        content = link;

        break;

      case "post":
        content = post;
        break;
      default:
    }
    const postId = await createPost(
      currentUser,
      subreadit,
      title,
      type,
      content
    );
    setTimeout(() => history.push(`/b/${subreadit.name}/${postId}`), 1000);
  };

  const loadDraft = (draft) => {
    setTitle(draft.title);
    setSubreadit(draft.subreadit);
    setType(draft.type);
    if (draft.type === "post") setPost(draft.content);
    if (draft.type === "link") setLink(draft.content);
    setCurrentDraft(draft.id);
  };

  return (
    <>
      <Container>
        <Header>
          <Heading>Create a post</Heading>
          <Drafts select={loadDraft} />
        </Header>

        <Subreadit initial={subreadit} select={setSubreadit} />

        <Main>
          <Type type={type} setType={setType} />
          <Form onSubmit={handleSubmit}>
            <Field>
              <Title title={title} setTitle={setTitle} />
            </Field>

            {type === "post" && (
              <Field>
                <TextEditor
                  type="post"
                  sendContent={setPost}
                  placeholder="Text (optional)"
                  prevContent={post}
                />
              </Field>
            )}

            {type === "image" && (
              <Field>
                <Image send={setImages} />
              </Field>
            )}

            {type === "link" && (
              <Field>
                <label htmlFor="link">
                  <Textarea
                    id="link"
                    name="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Url"
                  />
                </label>
                <MessageError>{linkError}</MessageError>
              </Field>
            )}

            <Buttons>
              {type !== "image" && (
                <>
                  {currentDraft ? (
                    <UpdateDraft
                      draftId={currentDraft}
                      subreadit={subreadit}
                      title={title}
                      type={type}
                      post={post}
                      link={link}
                    />
                  ) : (
                    <SaveDraft
                      subreadit={subreadit}
                      title={title}
                      type={type}
                      post={post}
                      link={link}
                      setDraft={setCurrentDraft}
                    />
                  )}
                </>
              )}

              <ButtonFilled
                type="submit"
                disabled={
                  (type === "post" && (!title || !subreadit.id)) ||
                  (type === "link" && (!title || !link || !subreadit.id)) ||
                  (type === "image" && (!title || !images || !subreadit.id))
                }
              >
                Post
              </ButtonFilled>
            </Buttons>
          </Form>
        </Main>
      </Container>
    </>
  );
}

export default CreatePost;

CreatePost.propTypes = {
  location: PropTypes.shape({
    type: PropTypes.string,
    subreadit: PropTypes.string,
  }).isRequired,
};

const Container = styled.div`
  width: 100%;
  max-width: 40rem;
  margin: 3rem 0;
`;

const Main = styled.div`
  background: ${(props) => props.theme.bg_container};
  margin-top: 1rem;
  border-radius: 5px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Heading = styled.h2`
  font-size: 1.125rem;
`;

const Form = styled.form`
  margin: 1rem;
`;

const Field = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  border: 1px solid ${(props) => props.theme.border_secondary};
  padding: 0.5rem;
  border-radius: 5px;
  background: ${(props) => props.theme.input_bg};
  color: ${(props) => props.theme.text_primary};

  &:focus {
    outline: 1px solid transparent;
    border: 1px solid ${(props) => props.theme.border_active};
  }
`;

const Buttons = styled.div`
  padding: 1rem 0;
  display: flex;
  justify-content: flex-end;

  & > button {
    margin-right: 1rem;
  }

  & > button:last-child {
    margin-right: 0;
  }
`;

const Button = styled.button`
  display: block;
  border: 1px solid ${(props) => props.theme.accent_secondary};
  color: ${(props) => props.theme.accent_secondary};
  border-radius: 5rem;
  padding: 0.35rem 1.25rem;
  font-weight: 500;
  text-align: center;

  &:hover {
    color: ${(props) => props.theme.accent_secondary_active};
    border: 1px solid ${(props) => props.theme.accent_secondary_active};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${(props) => props.theme.accent_secondary_disabled};
    border: 1px solid ${(props) => props.theme.accent_secondary_disabled};
  }
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.bg_container};
  background-color: ${(props) => props.theme.accent_secondary};
  border: 1px solid ${(props) => props.theme.accent_secondary};

  &:hover {
    color: ${(props) => props.theme.bg_container};
    background-color: ${(props) => props.theme.accent_secondary_active};
    border: 1px solid ${(props) => props.theme.accent_secondary_active};
  }

  &:disabled {
    color: ${(props) => props.theme.bg_container};
    background-color: ${(props) => props.theme.accent_secondary_disabled};
    border: 1px solid ${(props) => props.theme.accent_secondary_disabled};
  }
`;

const MessageError = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.error};
  top: -0.5rem;
`;
