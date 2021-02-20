/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import redraft from "redraft";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSubscription } from "../../contexts/SubscriptionContext";
import useComment from "../../hooks/useComment";
import useVote from "../../hooks/useVote";
import usePost from "../../hooks/usePost";
import useSubreadit from "../../hooks/useSubreadit";
import Entry from "../entry/Entry";
import Carousel from "./Carousel";
import LinkPreview from "./LinkPreview";
import { renderers } from "../TextEditor";
import "../../styles/textEditor.css";

// Icons
import { ReactComponent as IconUp } from "../../assets/icons/general/icon-upvote.svg";
import { ReactComponent as IconDown } from "../../assets/icons/general/icon-downvote.svg";
import { ReactComponent as IconComment } from "../../assets/icons/general/icon-comment.svg";
import { ReactComponent as IconSave } from "../../assets/icons/general/icon-save.svg";
import { ReactComponent as IconHide } from "../../assets/icons/general/icon-hide.svg";
import { ReactComponent as IconLink } from "../../assets/icons/general/icon-link-small.svg";

function PostPreview({ postId }) {
  const { currentUser } = useAuth();
  const { getPost } = usePost();
  const { getCommentsNumber } = useComment();
  const { joinSubreadit } = useSubreadit();
  const { vote, votes, handleUpvote, handleDownvote } = useVote(
    "posts",
    postId,
    currentUser && currentUser.uid
  );
  const { subscriptions } = useSubscription();
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
            <Main to={`/b/${post.subreadit.name}`}>
              <Link to={`/b/${post.subreadit.name}`}>
                <Informations>
                  <Link to={`/b/${post.subreadit.name}`}>
                    <BoldPrimary>
                      b/
                      {post.subreadit.name}
                    </BoldPrimary>
                  </Link>
                  <span> • Posted by </span>
                  <Link to={`/u/${post.author.id}`}>
                    u/
                    {post.author.name}
                    &nbsp;
                  </Link>
                  <Link to={`/b/${post.subreadit.name}/${postId}`}>
                    {formatDistanceStrict(
                      new Date(post.date.seconds * 1000),
                      new Date()
                    )}
                    &nbsp; ago
                  </Link>
                  {subscriptions.filter(
                    (subreadit) => subreadit.id === post.subreadit.id
                  ).length === 0 && (
                    <JoinButton
                      onClick={(e) => {
                        e.preventDefault();
                        joinSubreadit(currentUser.uid, post.subreadit);
                      }}
                    >
                      Join
                    </JoinButton>
                  )}
                </Informations>
                {post.type !== "link" && (
                  <Link to={`/b/${post.subreadit.name}/${postId}`}>
                    <Title>{post.title}</Title>
                  </Link>
                )}
                <>
                  {post.type === "post" &&
                    renderText(post.content, post.subreadit.name, postId)}
                  {post.type === "image" &&
                    renderImages(post.content, post.title)}
                  {post.type === "link" && renderLink(post.content, post.title)}
                </>
              </Link>
              <Buttons>
                <ButtonLink to={`/b/${post.subreadit.name}/${postId}`}>
                  <IconComment />
                  {commentsNumber} Comment
                  {commentsNumber !== 1 && "s"}
                </ButtonLink>
                <Button
                  type="button"
                  onClick={(e) => {
                    {
                      /* Avoid Link */
                    }
                    e.preventDefault();
                  }}
                >
                  <IconSave />
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsHidden(true);
                  }}
                >
                  <IconHide />
                  Hide
                </Button>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    copyLink();
                  }}
                >
                  <IconLink />
                  Share
                  <InputCopy
                    type="text"
                    value={`https://breadit-296d8.web.app/b/${post.subreadit.name}/${postId}`}
                    ref={copyRef}
                    readOnly
                  />
                </Button>
              </Buttons>
            </Main>
          </Container>

          <EntryModal
            isOpen={isEntryOpen}
            onRequestClose={() => setIsEntryOpen(false)}
          >
            <Entry close={() => setIsEntryOpen(false)} />
          </EntryModal>
        </>
      )}
    </>
  );
}

PostPreview.propTypes = {
  postId: PropTypes.string.isRequired,
};
export default PostPreview;

const colors = {
  primary: "black",
  secondary: "grey",
  background: "rgb(255, 255, 255)",
  voteBackground: "rgb(247, 244, 240)",
  arrowBackground: "rgb(237, 212, 194)",
  upvote: "rgb(179, 72, 54)",
  downvote: "rgb(70, 153, 147)",
  neutral: "rgb(209, 163, 155)",
};

const Container = styled.article`
  border: 1px solid ${colors.neutral};
  display: flex;
  border-radius: 0.25rem;
  background: ${colors.background};

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

const Vote = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${colors.voteBackground};
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
      ? colors.upvote
      : props.isDownvoted
      ? colors.downvote
      : colors.neutral};
  cursor: pointer;
  padding: 0;
  border-radius: 0.15rem;
  width: 1.5rem;
  height: 1.5rem;

  &:hover {
    background: ${colors.arrowBackground};
  }
`;

const Main = styled(Link)`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  padding: 0.5rem;
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

const Buttons = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.secondary};
  display: flex;
  align-items: stretch;
  padding: 0.5rem;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  & > *:hover {
    background: ${colors.voteBackground};
  }
`;

const Button = styled.button`
  font-size: 0.75rem;
  font-weight: 500;

  & > *:first-child {
    margin-right: 0.15rem;
  }
`;

const JoinButton = styled.button``;

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

const EntryModal = styled(Modal)`
  width: 30rem;
  height: 30rem;
  border: 1px solid red;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
