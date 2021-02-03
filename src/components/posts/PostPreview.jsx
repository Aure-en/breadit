import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useVote from "../../hooks/useVote";
import Entry from "../entry/Entry";
import { useAuth } from "../../contexts/AuthContext";
import { ReactComponent as IconUp } from "../../assets/icons/icon-upvote.svg";
import { ReactComponent as IconDown } from "../../assets/icons/icon-downvote.svg";

const Container = styled.div``;

const BoldPrimary = styled.div``;

const BoldSecondary = styled(BoldPrimary)``;

const Informations = styled.div``;

const Vote = styled.button`
  color: ${(props) => (props.active ? "red" : "black")};
`;

function PostPreview({ subreadit, author, date, content, id }) {
  const { currentUser } = useAuth();
  const { vote, votes, handleUpvote, handleDownvote } = useVote(
    "posts",
    id,
    currentUser && currentUser.uid
  );
  const [isEntryOpen, setIsEntryOpen] = useState(false);

  return (
    <>
      <Container>
        <div>
          <Vote
            type="button"
            active={vote === 1}
            onClick={() => {
              // eslint-disable-next-line no-unused-expressions
              currentUser
                ? handleUpvote("posts", id, currentUser.uid, vote)
                : setIsEntryOpen(true);
            }}
          >
            <IconUp />
          </Vote>
          <span>{votes}</span>
          <Vote
            type="button"
            active={vote === -1}
            onClick={() => {
              // eslint-disable-next-line no-unused-expressions
              currentUser
                ? handleDownvote("posts", id, currentUser.uid, vote)
                : setIsEntryOpen(true);
            }}
          >
            <IconDown />
          </Vote>
        </div>
        <div>
          <BoldPrimary>{subreadit}</BoldPrimary>
          <Informations>
            Posted by u/
            {author}
            {date}
          </Informations>
          <div>{content}</div>
          <BoldSecondary>Comments</BoldSecondary>
        </div>
      </Container>

      {isEntryOpen && <Entry close={() => setIsEntryOpen(false)} />}
    </>
  );
}

PostPreview.propTypes = {
  subreadit: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.number),
  ]).isRequired,
};
export default PostPreview;
