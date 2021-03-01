/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";
import redraft from "redraft";
import { useAuth } from "../../../contexts/AuthContext";
import { useSave } from "../../../contexts/SaveContext";
import useComment from "../../../hooks/useComment";
import useVote from "../../../hooks/useVote";
import usePost from "../../../hooks/usePost";
import Entry from "../../entry/Entry";
import Carousel from "../../shared/Carousel";
import LinkPreview from "../../feed/LinkPreview";
import TextEditor, { renderers } from "../../shared/TextEditor";
import "../../../styles/textEditor.css";

// Icons
import { ReactComponent as IconUp } from "../../../assets/icons/general/icon-upvote.svg";
import { ReactComponent as IconDown } from "../../../assets/icons/general/icon-downvote.svg";
import { ReactComponent as IconComment } from "../../../assets/icons/general/icon-comment.svg";
import { ReactComponent as IconSave } from "../../../assets/icons/general/icon-save.svg";
import { ReactComponent as IconSaved } from "../../../assets/icons/general/icon-save-filled.svg";
import { ReactComponent as IconLink } from "../../../assets/icons/general/icon-link-small.svg";

function Post({ postId, subreadit }) {
  const { currentUser } = useAuth();
  const { saved, handleSave } = useSave();
  const { getPost, editPost, deletePost } = usePost();
  const { getCommentsNumber } = useComment();
  const { vote, votes, handleUpvote, handleDownvote } = useVote(
    "posts",
    postId,
    currentUser && currentUser.uid
  );
  const [post, setPost] = useState();
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState("");
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

  // Copy the post link
  const copyLink = () => {
    if (!copyRef) return;
    copyRef.current.select();
    copyRef.current.setSelectionRange(0, 99999);
    document.execCommand("copy");
  };

  return (
    <>
      {post && (
        <>
          <Container>
            <Vote>
              <VoteButton
                type="button"
                isUpvoted={vote === 1}
                onClick={() => {
                  // eslint-disable-next-line no-unused-expressions
                  currentUser
                    ? handleUpvote("posts", postId, currentUser.uid, vote)
                    : setIsEntryOpen(true);
                }}
              >
                <IconUp />
              </VoteButton>
              <span>{votes}</span>
              <VoteButton
                type="button"
                isDownvoted={vote === -1}
                onClick={() => {
                  // eslint-disable-next-line no-unused-expressions
                  currentUser
                    ? handleDownvote("posts", postId, currentUser.uid, vote)
                    : setIsEntryOpen(true);
                }}
              >
                <IconDown />
              </VoteButton>
            </Vote>
            <Main>
              {subreadit && (
                <>
                  <Informations>
                    <Link to={`/b/${subreadit.toLowerCase()}`}>
                      <BoldPrimary>
                        b/
                        {subreadit.toLowerCase()}
                      </BoldPrimary>
                    </Link>
                    <span> • Posted by </span>
                    <Link to={`/user/${post.author.name}`}>
                      u/
                      {post.author.name}
                    </Link>{" "}
                    {formatDistanceStrict(
                      new Date(post.date.seconds * 1000),
                      new Date()
                    )}
{" "}
                    ago
                  </Informations>
                  {post.type !== "link" && <Title>{post.title}</Title>}
                  <>
                    {post.type === "post" && isEditing && (
                      <Editor>
                        <TextEditor
                          type="post"
                          sendContent={setEdit}
                          prevContent={post.content}
                        />
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                        <button type="button" onClick={handleEdit}>
                          Save Changes
                        </button>
                      </Editor>
                    )}
                    {post.type === "post" &&
                      !isEditing &&
                      post.content &&
                      renderText(post.content, subreadit, postId)}
                    {post.type === "image" &&
                      renderImages(post.content, post.title)}
                    {post.type === "link" &&
                      renderLink(post.content, post.title)}
                  </>
                  <Buttons>
                    <ButtonLink to={`/b/${subreadit}/${postId}`}>
                      <IconComment />
                      {commentsNumber} Comment
                      {commentsNumber !== 1 && "s"}
                    </ButtonLink>
                    <Button
                      type="button"
                      onClick={() =>
                        handleSave(currentUser.uid, postId, "post")}
                    >
                      {saved.includes(postId) ? <IconSaved /> : <IconSave />}
                      Save
                    </Button>
                    <Button type="button" onClick={copyLink}>
                      <IconLink />
                      Share
                      <InputCopy
                        type="text"
                        value={`https://breadit-296d8.web.app/b/${subreadit}/${postId}`}
                        ref={copyRef}
                        readOnly
                      />
                    </Button>
                    {post.type === "post" && (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        Edit
                      </Button>
                    )}
                    <Button type="button" onClick={() => deletePost(postId)}>
                      Delete
                    </Button>
                  </Buttons>
                </>
              )}
            </Main>
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
  display: flex;
  border-radius: 0.25rem;
  margin: 1rem 0;
`;

const BoldPrimary = styled.div`
  font-weight: 600;
  color: ${(props) => props.theme.primary};
`;

const Informations = styled.div`
  display: flex;
  font-size: 0.75rem;
  color: ${(props) => props.theme.secondary};
  padding: 0.5rem;

  & > * {
    margin-right: 0.25rem;
  }

  & > a:hover {
    text-decoration: underline;
  }
`;

const Vote = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem 0 0.5rem;

  & > * {
    margin-bottom: 0.25rem;
  }
`;

const VoteButton = styled.button`
  color: ${(props) =>
    props.isUpvoted
      ? props.theme.upvote
      : props.isDownvoted
      ? props.theme.downvote
      : props.theme.secondary};
  cursor: pointer;
  padding: 0;
  border-radius: 0.15rem;
  width: 1.5rem;
  height: 1.5rem;

  &:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }
`;

const Main = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
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

const Buttons = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.secondary};
  display: flex;
  align-items: stretch;
  margin-top: 0.75rem;
  padding: 0.5rem;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  & > *:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }
`;

const Button = styled.button`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.secondary};

  & > *:first-child {
    margin-right: 0.15rem;
  }
`;

const ButtonLink = styled(Link)`
  & > *:first-child {
    margin-right: 0.15rem;
  }

  & > a {
    height: 100%;
  }
`;

const InputCopy = styled.input`
  position: absolute;
  top: -9999px;
`;

const Editor = styled.div`
  position: relative;
`;
