import React from "react";
import redraft from "redraft";
import PropTypes from "prop-types";
import styled from "styled-components";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";
import { renderers } from "../../shared/TextEditor";
import Information from "./Information";
import Buttons from "./Buttons";

function CommentNotification({
  id,
  type,
  date,
  content,
  post,
  subreadit,
  author,
}) {
  return (
    <article>
      <Container to={`/b/${subreadit.name}/${post.id}`}>
        <Information
          type={type}
          author={author.name}
          subreadit={subreadit.name}
          post={{
            id: post.id,
            title: post.title,
            author: post.author,
          }}
          date={date}
        />

        <Main>
          <div>
            <Informations>
              <StrongLink to={`/u/${author.name}`}>{author.name}</StrongLink>
              &nbsp;•&nbsp;
              {formatDistanceStrict(new Date(date.seconds * 1000), new Date())}
              &nbsp;ago
            </Informations>
            <div>
              {content.content &&
                redraft(JSON.parse(content.content), renderers)}
            </div>
          </div>
        </Main>

        <Buttons
          type="comment"
          subreadit={subreadit.name}
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
  author: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  post: PropTypes.shape({
    id: PropTypes.string,
    author: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    title: PropTypes.string,
    type: PropTypes.string,
    date: PropTypes.shape({
      seconds: PropTypes.number,
    }),
  }).isRequired,
  subreadit: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  content: PropTypes.shape({
    type: PropTypes.string,
    content: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
};

const Container = styled(Link)`
  display: block;
  border-bottom: 1px solid ${(props) => props.theme.border};
  border-top: 1px solid ${(props) => props.theme.border};
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  background: ${(props) => props.theme.bg_container};
  cursor: pointer;
  padding: 0.5rem;
  box-shadow: 0 0 10px -5px ${(props) => props.theme.shadow};

  &:hover {
    border-bottom: 1px solid ${(props) => props.theme.border_active};
    border-top: 1px solid ${(props) => props.theme.border_active};
  }

  @media all and (min-width: 40rem) {
    border: 1px solid ${(props) => props.theme.border};

    &:hover {
      border: 1px solid ${(props) => props.theme.border_active};
    }
  }
`;

const Informations = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.text_secondary};
`;

const Main = styled.div`
  display: flex;
  padding: 1rem;

  &:before {
    display: block;
    content: "";
    align-self: stretch;
    border-left: 2px solid ${(props) => props.theme.accent_soft};
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
  color: ${(props) => props.theme.text_primary};
`;
