import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import ReactHtmlParser from "react-html-parser";
import useVote from "../../hooks/useVote";
import Entry from "../entry/Entry";
import { useAuth } from "../../contexts/AuthContext";
import useSubreadit from "../../hooks/useSubreadit";

// Icons
import { ReactComponent as IconUp } from "../../assets/icons/icon-upvote.svg";
import { ReactComponent as IconDown } from "../../assets/icons/icon-downvote.svg";

const Container = styled.article``;

const BoldPrimary = styled.div``;

const BoldSecondary = styled(BoldPrimary)``;

const Informations = styled.div``;

const Vote = styled.button`
  color: ${(props) => (props.active ? "red" : "black")};
`;

const Image = styled.img``;

function PostPreview({ subreaditId, author, date, title, content, id }) {
  const { currentUser } = useAuth();
  const { getSubreaditById } = useSubreadit();
  const { vote, votes, handleUpvote, handleDownvote } = useVote(
    "posts",
    id,
    currentUser && currentUser.uid
  );
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [subreadit, setSubreadit] = useState();

  useEffect(() => {
    (async () => {
      const subreadit = await getSubreaditById(subreaditId);
      setSubreadit(subreadit.data());
    })();
  }, []);

  // Helper functions to render content depending on its type

  const renderText = (content) => {
    return (
      <div>
        {ReactHtmlParser(stateToHTML(convertFromRaw(JSON.parse(content))))}
      </div>
    );
  };

  const renderImage = (image, title) => {
    return (
      <div>
        <Image src="image" alt={title} />
      </div>
    );
  };

  const renderImages = (images, title) => {
    return <div />;
  };

  const renderLink = (link) => {
    <div />;
  };

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
          {subreadit && (
            <>
              <Link to={`/b/${subreadit.name}`}>
                <BoldPrimary>{subreadit.name}</BoldPrimary>
              </Link>

              <Informations>
                Posted by u/
                <Link to={`/user/${author.id}`}>{author}</Link>
                <Link to={`/b/${subreadit.name}/${id}`}>
                  {formatDistanceStrict(
                    new Date(date.seconds * 1000),
                    new Date()
                  )}
{" "}
                  ago
                </Link>
              </Informations>
              <div>{title}</div>
              <div>{renderText(content)}</div>
              <BoldSecondary>
                <Link to={`/b/${subreadit.name}/${id}`}>Comments</Link>
                <button type="button">Save</button>
              </BoldSecondary>
            </>
          )}
        </div>
      </Container>

      {isEntryOpen && <Entry close={() => setIsEntryOpen(false)} />}
    </>
  );
}

PostPreview.propTypes = {
  subreaditId: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.shape({
    seconds: PropTypes.number,
    nanoseconds: PropTypes.number,
  }).isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.number),
  ]).isRequired,
};
export default PostPreview;
