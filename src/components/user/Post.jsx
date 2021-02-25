import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useVote from "../../hooks/useVote";
import Entry from "../entry/Entry";

// Icons
import { ReactComponent as IconUp } from "../../assets/icons/general/icon-upvote.svg";
import { ReactComponent as IconDown } from "../../assets/icons/general/icon-downvote.svg";
import { ReactComponent as IconPost } from "../../assets/icons/general/icon-post.svg";
import { ReactComponent as IconLink } from "../../assets/icons/general/icon-link.svg";
import { ReactComponent as IconComment } from "../../assets/icons/general/icon-comment.svg";
import { ReactComponent as IconSave } from "../../assets/icons/general/icon-save.svg";
import { ReactComponent as IconHide } from "../../assets/icons/general/icon-hide.svg";
import { ReactComponent as IconLinkSmall } from "../../assets/icons/general/icon-link-small.svg";

function Post({ author, id, title, subreadit, type, content, comments, date }) {
  const { currentUser } = useAuth();
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { vote, votes, handleUpvote, handleDownvote } = useVote(
    "posts",
    id,
    currentUser && currentUser.uid
  );
  const copyRef = useRef();

  // Copy the post link
  const copyLink = () => {
    if (!copyRef) return;
    copyRef.current.select();
    copyRef.current.setSelectionRange(0, 99999);
    document.execCommand("copy");
  };

  return (
    <>
      {!isHidden && (
        <Container>
          <Vote>
            <VoteButton
              type="button"
              isUpvoted={vote === 1}
              onClick={() => {
                currentUser
                  ? handleUpvote("posts", id, currentUser.uid, vote)
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
                currentUser
                  ? handleDownvote("posts", id, currentUser.uid, vote)
                  : setIsEntryOpen(true);
              }}
            >
              <IconDown />
            </VoteButton>
          </Vote>
          <Main to={`/b/${subreadit.name}/${id}`}>
            <Link to={`/b/${subreadit.name}/${id}`}>
              <Preview>
                {type === "link" && <IconLink />}
                {type === "post" && <IconPost />}
                {type === "image" && <Image src={content[0]} alt={title} />}
              </Preview>
            </Link>
            <div>
              <Title>{title}</Title>
              <Informations>
                <Subreadit to={`/b/${subreadit.name}`}>
                  b/
                  {subreadit.name}
                  &nbsp;
                </Subreadit>
                <span> • Posted by&nbsp;</span>
                <InformationLink to={`/u/${author.id}`}>
                  u/
                  {author.name}
                </InformationLink>
                &nbsp;
                <InformationLink to={`/b/${subreadit.name}/${id}`}>
                  {formatDistanceStrict(
                    new Date(date.seconds * 1000),
                    new Date()
                  )}
                  &nbsp;ago
                </InformationLink>
              </Informations>
              <Buttons>
                <ButtonLink to={`/b/${subreadit.name}/${id}`}>
                  <IconComment />
                  {comments} Comment
                  {comments !== 1 && "s"}
                </ButtonLink>
                <Button
                  type="button"
                  onClick={(e) => {
                    /* Avoid Link */
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
                  <IconLinkSmall />
                  Share
                  <InputCopy
                    type="text"
                    value={`https://breadit-296d8.web.app/b/${subreadit.name}/${id}`}
                    ref={copyRef}
                    readOnly
                  />
                </Button>
              </Buttons>
            </div>
          </Main>

          <EntryModal
            isOpen={isEntryOpen}
            onRequestClose={() => setIsEntryOpen(false)}
          >
            <Entry close={() => setIsEntryOpen(false)} />
          </EntryModal>
        </Container>
      )}
    </>
  );
}

Post.propTypes = {
  author: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  subreadit: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  comments: PropTypes.number.isRequired,
  date: PropTypes.shape({
    seconds: PropTypes.number,
  }).isRequired,
};

export default Post;

const colors = {
  background: "white",
  primary: "black",
  secondary: "grey",
  preview: "grey",
  border: "grey",
  accent: "red",
  voteBackground: "rgb(247, 244, 240)",
  arrowBackground: "rgb(237, 212, 194)",
  upvote: "rgb(179, 72, 54)",
  downvote: "rgb(70, 153, 147)",
  neutral: "rgb(209, 163, 155)",
};

const Container = styled.article`
  display: flex;
  border: 1px solid ${colors.border};
  background: ${colors.background};
  cursor: pointer;

  &:hover {
    border: 1px solid ${colors.neutral};
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
  display: flex;
  align-items: center;
  padding: 0 1rem;
`;

const Preview = styled.div`
  width: 5rem;
  height: 3.5rem;
  min-width: 5rem;
  min-height: 3.5rem;
  border: 1px solid ${colors.preview};
  border-radius: 5px;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.25rem;
`;

const Informations = styled.div`
  display: flex;
  color: ${colors.secondary};
  font-size: 0.75rem;
`;

const InformationLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;

const Subreadit = styled(Link)`
  font-weight: 500;
  color: ${colors.primary};

  &:hover {
    text-decoration: underline;
  }
`;

const Buttons = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.secondary};
  display: flex;
  align-items: stretch;
  margin-top: 0.15rem;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  & > *:first-child {
    margin-left: -0.15rem;
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