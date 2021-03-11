import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useEntry } from "../../../contexts/EntryContext";
import useVote from "../../../hooks/useVote";

// Icons
import { ReactComponent as IconUp } from "../../../assets/icons/general/icon-upvote.svg";
import { ReactComponent as IconDown } from "../../../assets/icons/general/icon-downvote.svg";

function Vote({ type, docId, user, className }) {
  const { openSignUp } = useEntry();
  const { vote, votes, handleUpvote, handleDownvote } = useVote(
    type,
    docId,
    user && user.uid
  );

  return (
    <Container appearance={type} className={className}>
      <Button
        type="button"
        isUpvoted={vote === 1}
        onClick={(e) => {
          e.preventDefault();
          user ? handleUpvote(type, docId, user.uid, vote) : openSignUp();
        }}
        appearance={type}
      >
        <IconUp />
      </Button>
      <span>{votes}</span>
      <Button
        type="button"
        isDownvoted={vote === -1}
        onClick={(e) => {
          e.preventDefault();
          user ? handleDownvote(type, docId, user.uid, vote) : openSignUp();
        }}
        appearance={type}
      >
        <IconDown />
      </Button>
    </Container>
  );
}

export default Vote;

Vote.propTypes = {
  type: PropTypes.string.isRequired,
  docId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string,
  }),
  className: PropTypes.string,
};

Vote.defaultProps = {
  user: null,
  className: "",
};

const Container = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: ${(props) => props.theme.secondary};

  & > * {
    padding: 0 0.1rem;
  }

  & > button:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }

  ${(props) =>
    props.appearance === "posts" &&
    `
  @media all and (min-width: 768px) {
    flex-direction: column;
    align-items: center;
    font-weight: 600;
    margin-right: 0.5rem;
  }`}
`;

const Button = styled.button`
  color: ${(props) =>
    props.isUpvoted
      ? props.theme.upvote
      : props.isDownvoted
      ? props.theme.downvote
      : props.theme.secondary};
  border-radius: 3px;

  ${(props) =>
    props.appearance === "posts" &&
    `
    @media all and (min-width: 768px) {
      color: ${(props) =>
        props.isUpvoted
          ? props.theme.upvote
          : props.isDownvoted
          ? props.theme.downvote
          : props.theme.neutral};
      cursor: pointer;
      padding: 0;
      border-radius: 0.15rem;
      width: 1.5rem;
      height: 1.5rem;
  
      &:hover {
        background: ${props.theme.arrowHover};
      }
    `}
  }
`;
