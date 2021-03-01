import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useVote from "../../hooks/useVote";
import Entry from "../entry/Entry";

// Icons
import { ReactComponent as IconUp } from "../../assets/icons/general/icon-upvote.svg";
import { ReactComponent as IconDown } from "../../assets/icons/general/icon-downvote.svg";

function Vote({ type, docId, user }) {
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const { vote, votes, handleUpvote, handleDownvote } = useVote(
    type,
    docId,
    user && user.uid
  );

  return (
    <Container>
      <Button
        type="button"
        isUpvoted={vote === 1}
        onClick={() => {
          // eslint-disable-next-line no-unused-expressions
          user
            ? handleUpvote(type, docId, user.uid, vote)
            : setIsEntryOpen(true);
        }}
      >
        <IconUp />
      </Button>
      <span>{votes}</span>
      <Button
        type="button"
        isDownvoted={vote === -1}
        onClick={() => {
          // eslint-disable-next-line no-unused-expressions
          user
            ? handleDownvote(type, docId, user.uid, vote)
            : setIsEntryOpen(true);
        }}
      >
        <IconDown />
      </Button>
      {isEntryOpen && <Entry close={() => setIsEntryOpen(false)} />}
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
};

Vote.defaultProps = {
  user: null,
};

const Container = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: ${(props) => props.theme.secondary};

  & > * {
    padding: 0 .1rem;
  }

  & > button:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }

  @media all and (min-width: 768px) {
    flex-direction: column;
    align-items: center;
    background: ${(props) => props.theme.backgroundTertiary};
    font-weight: 600;
    padding: 0.5rem 0.5rem 0 0.5rem;
  }
`;

const Button = styled.button`
  color: ${(props) =>
    props.isUpvoted
      ? props.theme.upvote
      : props.isDownvoted
      ? props.theme.downvote
      : props.theme.secondary};
  border-radius: 3px;

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
      background: ${(props) => props.theme.arrowHover};
    }
  }
`;
