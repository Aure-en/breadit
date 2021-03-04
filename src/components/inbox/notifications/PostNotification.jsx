import React from "react";
import redraft from "redraft";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { renderers } from "../../shared/TextEditor";
import Information from "./Information";
import Buttons from "./Buttons";

function PostNotification({ id, content }) {
  return (
    <article>
      <Container to={`/b/${content.subreadit.name}/${content.id}`}>
        <Information
          type="mention"
          author={content.author.name}
          subreadit={content.subreadit.name}
          post={{
            id: content.id,
            title: content.title,
            author: content.author,
          }}
          date={content.date}
        />

        <Main to={`/b/${content.subreadit.name}/${content.id}`}>
          {redraft(JSON.parse(content.content), renderers)}
        </Main>

        <Buttons
          type="post"
          subreadit={content.subreadit.name}
          postId={content.id}
          notificationId={id}
        />
      </Container>
    </article>
  );
}

export default PostNotification;

PostNotification.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.shape({
    author: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    subreadit: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    date: PropTypes.shape({
      seconds: PropTypes.number,
    }).isRequired,
  }).isRequired,
};

const Container = styled(Link)`
  display: block;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.backgroundSecondary};
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    border: 1px solid ${(props) => props.theme.borderHover};
  }
`;

const Main = styled(Link)`
  display: flex;
  padding-left: 1rem;
`;