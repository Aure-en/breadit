import React from "react";
import redraft from "redraft";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { renderers } from "../../shared/TextEditor";
import Information from "./Information";
import Buttons from "./Buttons";

function PostNotification({ id, subreadit, post, date, content }) {
  return (
    <article>
      <Container to={`/b/${subreadit.name}/${post.id}`}>
        <Information
          type="mention"
          author={post.author.name}
          subreadit={subreadit.name}
          post={{
            id: post.id,
            title: post.title,
            author: post.author.name,
          }}
          date={date}
        />

        <Main to={`/b/${subreadit.name}/${post.id}`}>
          {content.content && redraft(JSON.parse(content.content), renderers)}
        </Main>

        <Buttons
          type="post"
          subreadit={subreadit.name}
          postId={post.id}
          notificationId={id}
        />
      </Container>
    </article>
  );
}

export default PostNotification;

PostNotification.propTypes = {
  id: PropTypes.string.isRequired,
  author: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  subreadit: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  post: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
  date: PropTypes.shape({
    seconds: PropTypes.number,
  }).isRequired,
  content: PropTypes.shape({
    content: PropTypes.string,
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

const Main = styled(Link)`
  display: flex;
  padding-left: 1rem;
`;
