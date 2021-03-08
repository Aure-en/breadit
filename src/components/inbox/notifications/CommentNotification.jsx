import React from "react";
import redraft from "redraft";
import PropTypes from "prop-types";
import styled from "styled-components";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";
import { renderers } from "../../shared/TextEditor";
import Information from "./Information";
import Buttons from "./Buttons";

function CommentNotification({ id, type, date, content, post }) {
  return (
    <article>
      <Container to={`/b/${post.subreadit.name}/${post.id}`}>
        <Information
          type={type}
          author={content.author.name}
          subreadit={post.subreadit.name}
          post={post}
          date={date}
        />

        <Main>
          <div>
            <Informations>
              <StrongLink to={`/u/${content.author.id}`}>
                {content.author.name}
              </StrongLink>
              &nbsp;•&nbsp;
              {formatDistanceStrict(
                new Date(content.date.seconds * 1000),
                new Date()
              )}
              &nbsp;ago
            </Informations>
            <div>{redraft(JSON.parse(content.content), renderers)}</div>
          </div>
        </Main>

        <Buttons
          type="comment"
          subreadit={post.subreadit.name}
          postId={post.id}
          notificationId={id}
          commentId={content.id}
        />
      </Container>
    </article>
  );
}

export default CommentNotification;

CommentNotification.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  date: PropTypes.shape({
    seconds: PropTypes.number,
  }).isRequired,
  content: PropTypes.shape({
    author: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    content: PropTypes.string,
    date: PropTypes.shape({
      seconds: PropTypes.number,
    }),
    id: PropTypes.string,
    postId: PropTypes.string,
    subreadit: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    title: PropTypes.string,
  }).isRequired,
  post: PropTypes.shape({
    author: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    id: PropTypes.string.isRequired,
    subreadit: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    date: PropTypes.shape({
      seconds: PropTypes.number,
    }).isRequired,
  }),
};

CommentNotification.defaultProps = {
  post: null,
};

const Container = styled(Link)`
  display: block;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.backgroundSecondary};
  cursor: pointer;
  padding: 0.5rem;
  box-shadow: 0 0 10px -5px ${(props) => props.theme.shadow};

  &:hover {
    border: 1px solid ${(props) => props.theme.borderHover};
  }
`;

const Informations = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.secondary};
`;

const Main = styled.div`
  display: flex;
  padding: 1rem;

  &:before {
    display: block;
    content: "";
    align-self: stretch;
    border-left: 2px solid ${(props) => props.theme.accentSoft};
    margin-right: 1rem;
  }
`;

const UnderlineLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;

const StrongLink = styled(UnderlineLink)`
  font-weight: 500;
  color: ${(props) => props.theme.primary};
`;
