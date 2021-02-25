/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import usePost from "../../hooks/usePost";
import useSubreadit from "../../hooks/useSubreadit";
import useDragAndDrop from "../../hooks/useDragAndDrop";
import useStorage from "../../hooks/useStorage";
import useDropdown from "../../hooks/useDropdown";
import TextEditor from "../../components/TextEditor";

// Icons
import { ReactComponent as IconCaretDown } from "../../assets/icons/general/icon-caret-down.svg";
import { ReactComponent as IconPost } from "../../assets/icons/general/icon-post.svg";
import { ReactComponent as IconImage } from "../../assets/icons/general/icon-image.svg";
import { ReactComponent as IconLink } from "../../assets/icons/general/icon-link.svg";
import { ReactComponent as IconPlus } from "../../assets/icons/general/icon-plus.svg";
import { ReactComponent as IconCheck } from "../../assets/icons/general/icon-check.svg";
import { ReactComponent as IconClose } from "../../assets/icons/general/icon-x.svg";

function CreatePost() {
  const [type, setType] = useState("post");
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [images, setImages] = useState("");
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [subreadits, setSubreadits] = useState([]);
  const [isHovered, setIsHovered] = useState();

  const { currentUser } = useAuth();
  const { getSubreadits } = useSubreadit();
  const { createPost } = usePost();
  const { uploadImage } = useStorage();
  const history = useHistory();
  const {
    inDragZone,
    files,
    deleteFile,
    preview,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useDragAndDrop();
  const dropdownRef = useRef();
  const {
    isDropdownOpen,
    setIsDropdownOpen,
    current,
    handleChoice,
  } = useDropdown(dropdownRef);

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
      current,
      title,
      type,
      content,
      spoiler
    );
    setTimeout(() => history.push(`/b/${current.name}/${postId}`), 1000);
  };

  return (
    <Wrapper>
      <Container>
        <div>
          <Heading>Create a post</Heading>
        </div>

        <Dropdown ref={dropdownRef}>
          <DropdownHeader
            isDropdownOpen={isDropdownOpen}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {current ? current.name : "Choose a community"}
            <IconCaretDown />
          </DropdownHeader>
          {isDropdownOpen && (
            <DropdownList>
              {subreadits.map((subreadit) => {
                return (
                  <li key={subreadit.id}>
                    <DropdownChoice onClick={() => handleChoice(subreadit)}>
                      <SubreaditIcon
                        src={subreadit.icon}
                        alt={subreadit.name}
                      />
                      <div>
                        <Bold>b/{subreadit.name}</Bold>
                        <Small>
                          {subreadit.members} member
                          {subreadit.members !== 1 && "s"}
                        </Small>
                      </div>
                    </DropdownChoice>
                  </li>
                );
              })}
            </DropdownList>
          )}
        </Dropdown>

        <Main>
          <Tabs>
            <Tab
              type="button"
              onClick={() => setType("post")}
              isSelected={type === "post"}
            >
              <IconPost /> Post
            </Tab>
            <Tab
              type="button"
              onClick={() => setType("image")}
              isSelected={type === "image"}
            >
              <IconImage /> Image
            </Tab>
            <Tab
              type="button"
              onClick={() => setType("link")}
              isSelected={type === "link"}
            >
              <IconLink /> Link
            </Tab>
          </Tabs>
          <Form onSubmit={handleSubmit}>
            <Field>
              <label htmlFor="title">
                <Input
                  type="text"
                  value={title}
                  id="title"
                  name="title"
                  onChange={(e) => {
                    e.target.value.length > 300
                      ? setTitle(e.target.value.slice(0, 300))
                      : setTitle(e.target.value);
                  }}
                  placeholder="Title"
                />
              </label>
              <TitleLength>{title.length}/300</TitleLength>
            </Field>

            {type === "post" && (
              <Field>
                <TextEditor
                  type="post"
                  sendContent={setPost}
                  placeholder="Text (optional)"
                />
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
                  center={files.length === 0}
                >
                  {files.length !== 0 ? (
                    <Preview>
                      {preview.map((image, index) => {
                        return (
                          <ImageContainer
                            key={image}
                            onMouseEnter={() => setIsHovered(index)}
                            onMouseLeave={() => setIsHovered(null)}
                          >
                            <Image src={image} alt="preview" />
                            {isHovered === index && (
                              <DeleteButton onClick={() => deleteFile(index)}>
                                <IconClose />
                              </DeleteButton>
                            )}
                          </ImageContainer>
                        );
                      })}
                    </Preview>
                  ) : (
                    <div>
                      Drag and drop or{" "}
                      <Upload>
                        <HiddenInput type="file" />
                        Upload
                      </Upload>
                    </div>
                  )}
                </DropArea>
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
              </Field>
            )}

            <Buttons>
              <ButtonBool
                type="button"
                onClick={() => setSpoiler(!spoiler)}
                isChecked={spoiler === true}
              >
                {spoiler ? <IconCheck /> : <IconPlus />}
                Spoiler
              </ButtonBool>
              <SubmitBtn
                type="submit"
                disabled={
                  (type === "post" && (!title || !current)) ||
                  (type === "link" && (!title || !link || !current)) ||
                  (type === "media" && (!title || !images || !current))
                }
              >
                Post
              </SubmitBtn>
            </Buttons>
          </Form>
        </Main>
      </Container>
    </Wrapper>
  );
}

export default CreatePost;

const colors = {
  primary: "rgb(179, 72, 54)",
  secondary: "rgb(255, 255, 255)",
  background: "rgb(241, 236, 230)",
  border: "rgb(242, 234, 230)",
  disabled: "rgb(222, 188, 171)",
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  background: ${colors.background};
  padding: 3rem;
  flex: 1;
`;

const Container = styled.div`
  width: 100%;
  max-width: 50rem;
`;

const Main = styled.div`
  background: ${colors.secondary};
  margin-top: 1rem;
  border-radius: 5px;
`;

const Header = styled.div`
  border-bottom: 1px solid blue;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.border};
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  border-left: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: -0.5rem;
  font-weight: ${(props) => props.isSelected && "500"};
  color: ${(props) => props.isSelected && colors.primary};
  border-bottom: ${(props) =>
    props.isSelected ? `2px solid ${colors.primary}` : "2px solid transparent"};

  & > *:first-child {
    margin-right: 0.5rem;
  }
`;

const Heading = styled.h2`
  font-size: 1.125rem;
`;

const Dropdown = styled.div`
  position: relative;
  max-width: 20rem;
  border: 1px solid ${colors.border};
  z-index: 1;
`;

const DropdownHeader = styled.button`
  display: grid;
  grid-template-columns: 1fr auto;
  background: ${colors.secondary};
  padding: 0.75rem;
  border-radius: ${(props) => (props.isDropdownOpen ? "5px 5px 0 0" : "5px")};
  cursor: pointer;
  width: 100%;
  justify-items: start;
`;

const DropdownList = styled.ul`
  position: absolute;
  left: 0;
  right: 0;
  background: ${colors.secondary};
  max-height: 25rem;
  overflow-y: auto;
  padding: 0.75rem 0;

  & > li {
    margin: 0 0.5rem 1rem 0.5rem;
  }

  & > li:last-child {
    margin: 0 0.5rem 0 0.5rem;
  }
`;

const DropdownChoice = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0;

  & > * {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SubreaditIcon = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const Bold = styled.div`
  font-weight: 500;
`;

const Small = styled.div`
  font-size: 0.75rem;
  color: ${colors.secondary};
`;

const Form = styled.form`
  margin: 1rem;
`;

const Field = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const input = `
  width: 100%;
  border: 1px solid ${colors.border};
  padding: 0.5rem;
  border-radius: 5px;

  &:focus {
    outline: none;
    border: 1px solid ${colors.primary};
  }
`;

const Input = styled.input`
  ${input}
`;

const Textarea = styled.textarea`
  ${input}
`;

const DropArea = styled.div`
  max-width: 50rem;
  min-height: 200px;
  border: ${(props) =>
    props.areFilesDragged
      ? `2px dashed ${colors.primary}`
      : `1px dashed ${colors.border}`};
  ${(props) =>
    props.center &&
    `display: flex;
    align-items: center;
    justify-content: center;
  `}
`;

const Preview = styled.div`
  max-width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 1rem;
  padding: 1rem;
  justify-items: center;
`;

const ImageContainer = styled.div`
  position: relative;
  background: ${colors.backgroundImage};
  border: 1px solid ${colors.disabled};
  width: 8.4rem;
  height: 8.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const TitleLength = styled.span`
  position: absolute;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.5rem;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;

const button = `
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
`;

const buttonEmpty = `
  color: ${colors.primary};
  border: 1px solid ${colors.primary};
`;

const Buttons = styled.div`
  padding: 1rem 0;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  ${button}
`;

const DeleteButton = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0.25rem;
  right: 0.25rem;
  border-radius: 50%;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
`;

const Upload = styled.label`
  display: inline-block;
  ${button}
  ${buttonEmpty}
  cursor: pointer;
  margin-left: 0.5rem;
`;

const HiddenInput = styled.input`
  position: absolute;
  top: -9999px;
`;

const ButtonBool = styled(Button)`
  display: flex;
  align-items: center;
  border: 1px solid
    ${(props) => (props.isChecked ? colors.primary : colors.disabled)};
  color: ${(props) => (props.isChecked ? colors.secondary : colors.disabled)};
  background: ${(props) => props.isChecked && colors.primary};

  & > *:first-child {
    margin-left: -0.5rem;
    margin-right: 0.5rem;
  }
`;

const SubmitBtn = styled(Button)`
  color: ${colors.secondary};
  background: ${(props) => (props.disabled ? colors.disabled : colors.primary)};
  border: 1px solid transparent;
`;
