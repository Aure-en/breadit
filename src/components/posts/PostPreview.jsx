import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";
import { convertFromRaw } from "draft-js";
import redraft from "redraft";
import useVote from "../../hooks/useVote";
import Entry from "../entry/Entry";
import { useAuth } from "../../contexts/AuthContext";
import useSubreadit from "../../hooks/useSubreadit";
import "../../styles/textEditor.css";

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

const renderers = {
  inline: {
    // The key passed here is just an index based on rendering order inside a block
    BOLD: (children, { key }) => <strong key={key}>{children}</strong>,
    ITALIC: (children, { key }) => <em key={key}>{children}</em>,
    UNDERLINE: (children, { key }) => <u key={key}>{children}</u>,
    CODE: (children, { key }) => <span key={key}>{children}</span>,
    HEADING: (children, { key }) => <h2 className="heading" key={key}>{children}</h2>,
  },
  blocks: {
    unstyled: (children) => children.map(child => <p>{child}</p>),
    codeBlock: (children, { key }) => <div key={key} className="codeBlock">{children}</div>,
    quoteBlock: (children, { key }) => <div key={key} className="quoteBlock">{children}</div>,
  },
};

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
        {redraft(JSON.parse(content), renderers)}
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
