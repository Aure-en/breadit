/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import usePost from "../../hooks/usePost";
import useSubreadit from "../../hooks/useSubreadit";
import useDragAndDrop from "../../hooks/useDragAndDrop";
import useStorage from "../../hooks/useStorage";
import TextEditor from "../../components/TextEditor";

const Form = styled.form``;

const Field = styled.div``;

const Label = styled.label``;

const Input = styled.input``;

const DropArea = styled.div`
  max-width: 600px;
  min-height: 200px;
  border: 1px solid ${(props) => (props.areFilesDragged ? "red" : "blue")};
`;

const Preview = styled.div`
  max-width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
`;

const Image = styled.img`
  width: 7.5rem;
  height: 7.5rem;
`;

const Textarea = styled.textarea``;

const Buttons = styled.div`
  margin-top: 4rem;
`;

const Button = styled.button``;

function CreatePost() {
  const [type, setType] = useState("post");
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [images, setImages] = useState("");
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [subreadits, setSubreadits] = useState([]);
  const [subreadit, setSubreadit] = useState();

  const { currentUser } = useAuth();
  const { getSubreadits } = useSubreadit();
  const { createPost } = usePost();
  const { uploadImage } = useStorage();
  const history = useHistory();
  const {
    inDragZone,
    files,
    preview,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useDragAndDrop();

  // Get list of subreadits
  useEffect(() => {
    (async () => {
      const subreaditsList = await getSubreadits();
      setSubreadits(subreaditsList);
    })();
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
          files.map(async (file) => {
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
      subreadit.id,
      title,
      type,
      content,
      spoiler
    );
    history.push(`/${postId}`);
  };

  return (
    <>
      <div>{subreadit ? subreadit.name : "Choose a community"}</div>
      <ul>
        {subreadits.map((subreadit) => {
          return (
            <li key={subreadit.id} onClick={() => setSubreadit(subreadit)}>
              {subreadit.name}
            </li>
          );
        })}
      </ul>

      <div>
        <button type="button" onClick={() => setType("post")}>
          Post
        </button>
        <button type="button" onClick={() => setType("image")}>
          Image
        </button>
        <button type="button" onClick={() => setType("link")}>
          Link
        </button>
      </div>
      <Form onSubmit={handleSubmit}>
        <Field>
          <div>
            <Label htmlFor="title">
              <Input
                type="text"
                value={title}
                id="title"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </Label>
            <div>{title.length} / 300</div>
          </div>
        </Field>

        {type === "post" && (
          <Field>
            <Label htmlFor="text">
              <div>
                <TextEditor type="post" sendContent={setPost} />
              </div>
            </Label>
          </Field>
        )}

        {type === "image" && (
          <Field>
            <DropArea
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              areFilesDragged={inDragZone}
            >
              {files ? (
                <Preview>
                  {preview.map((image, index) => {
                    return (
                      <Image
                        key={`preview_${index}`}
                        src={image}
                        alt="preview"
                      />
                    );
                  })}
                </Preview>
              ) : (
                "Drag and drop or Upload"
              )}
            </DropArea>
            <useDragAndDrop />
          </Field>
        )}

        {type === "link" && (
          <Field>
            <Label htmlFor="link">
              <Textarea
                id="link"
                name="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Label>
          </Field>
        )}

        <Buttons>
          <Button type="button" onClick={() => setSpoiler(!spoiler)}>
            Spoiler
          </Button>
          <Button
            type="submit"
            disabled={
              (type === "post" && (!title || !post)) ||
              (type === "link" && (!title || !link)) ||
              (type === "media" && (!title || !images))
            }
          >
            Post
          </Button>
        </Buttons>
      </Form>
    </>
  );
}

export default CreatePost;
