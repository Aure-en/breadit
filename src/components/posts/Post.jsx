/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";
import redraft from "redraft";
import { useAuth } from "../../contexts/AuthContext";
import useComment from "../../hooks/useComment";
import useVote from "../../hooks/useVote";
import usePost from "../../hooks/usePost";
import "../../styles/textEditor.css";
import Entry from "../entry/Entry";
import Carousel from "./Carousel";
import LinkPreview from "./LinkPreview";

// Icons
import { ReactComponent as IconUp } from "../../assets/icons/general/icon-upvote.svg";
import { ReactComponent as IconDown } from "../../assets/icons/general/icon-downvote.svg";
import { ReactComponent as IconComment } from "../../assets/icons/general/icon-comment.svg";
import { ReactComponent as IconSave } from "../../assets/icons/general/icon-save.svg";
import { ReactComponent as IconLink } from "../../assets/icons/general/icon-link-small.svg";

const renderers = {
  inline: {
    // The key passed here is just an index based on rendering order inside a block
    BOLD: (children, { key }) => <strong key={key}>{children}</strong>,
    ITALIC: (children, { key }) => <em key={key}>{children}</em>,
    UNDERLINE: (children, { key }) => <u key={key}>{children}</u>,
    CODE: (children, { key }) => (
      <span key={key} className="code">
        {children}
      </span>
    ),
    HEADING: (children, { key }) => (
      <div className="heading" key={key}>
        {children}
      </div>
    ),
    STRIKETHROUGH: (children, { key }) => (
      <span key={key} className="strikethrough">
        {children}
      </span>
    ),
  },
  blocks: {
    unstyled: (children, { key }) =>
      children.map((child) => (
        <div key={key} className="block">
          {child}
        </div>
      )),
    codeBlock: (children, { key }) =>
      children.map((child) => (
        <pre key={key} className="codeBlock">
          {child}
        </pre>
      )),
    quoteBlock: (children, { key }) =>
      children.map((child) => (
        <div key={key} className="quoteBlock">
          {child}
        </div>
      )),
    "unordered-list-item": (children, { keys }) => (
      <ul key={keys[keys.length - 1]}>
        {children.map((child) => (
          <li key={keys[keys.length - 1]}>{child}</li>
        ))}
      </ul>
    ),
    "ordered-list-item": (children, { keys }) => (
      <ol key={keys.join("|")}>
        {children.map((child, index) => (
          <li key={keys[index]}>{child}</li>
        ))}
      </ol>
    ),
  },
};

function Post({ postId, subreadit }) {
  const { currentUser } = useAuth();
  const { getPost } = usePost();
  const { getCommentsNumber } = useComment();
  const { vote, votes, handleUpvote, handleDownvote } = useVote(
    "posts",
    postId,
    currentUser && currentUser.uid
  );
  const [post, setPost] = useState();
  const [isEntryOpen, setIsEntryOpen] = useState(false);
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
      {post && (
        <>
          <Link to={`/b/${subreadit}/${postId}`}>
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
                      <Link to={`/b/${subreadit}`}>
                        <BoldPrimary>
                          b/
                          {subreadit}
                        </BoldPrimary>
                      </Link>
                      <span> • Posted by </span>
                      <Link to={`/user/${post.author.id}`}>
                        u/
                        {post.author.name}
                      </Link>{" "}
                      <Link to={`/b/${subreadit}/${postId}`}>
                        {formatDistanceStrict(
                          new Date(post.date.seconds * 1000),
                          new Date()
                        )}
{" "}
                        ago
                      </Link>
                    </Informations>
                    {post.type !== "link" && (
                      <Link to={`/b/${subreadit}/${postId}`}>
                        <Title>{post.title}</Title>
                      </Link>
                    )}
                    <>
                      {post.type === "post" &&
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
                      <Button type="button">
                        <IconSave />
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
                    </Buttons>
                  </>
                )}
              </Main>
            </Container>
          </Link>

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

const colors = {
  primary: "black",
  secondary: "grey",
  background: "rgb(241, 236, 230)",
  arrowBackground: "rgb(237, 212, 194)",
  upvote: "rgb(179, 72, 54)",
  downvote: "rgb(70, 153, 147)",
  neutral: "rgb(209, 163, 155)",
};

const Container = styled.article`
  display: flex;
  border-radius: 0.25rem;
  margin: 1rem 0;
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

const Main = styled.div`
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
  margin-top: 0.75rem;
  padding: 0.5rem;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  & > *:hover {
    background: ${colors.background};
  }
`;

const Button = styled.button`
  font-size: 0.75rem;
  font-weight: 500;

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
