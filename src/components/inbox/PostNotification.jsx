import React from "react";
import redraft from "redraft";
import PropTypes from "prop-types";
import styled from "styled-components";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";
import { renderers } from "../TextEditor";

function PostNotification({ id, content }) {
  return (
    <article>
      <Container>
        <Header to={`/b/${content.subreadit.name}/${content.id}`}>
          <AccentLink to={`/u/${content.author.name}`}>
            {content.author.name}
            &nbsp;
          </AccentLink>
          <span> mentioned you on </span>
          <PostLink to={`/b/${content.subreadit.name}/${content.id}`}>
            {content.title}
          </PostLink>
          <span> • </span>
          <StrongLink to={`/b/${content.subreadit.name}`}>
            b/
            {content.subreadit.name}
          </StrongLink>
          &nbsp;• Posted by&nbsp;
          <UnderlineLink to={`/u/${content.author.id}`}>
            {content.author.name}
          </UnderlineLink>
          <span> • </span>
          <UnderlineLink to={`/b/${content.subreadit.name}/${content.id}`}>
            {formatDistanceStrict(
              new Date(content.date.seconds * 1000),
              new Date()
            )}
          </UnderlineLink>
        </Header>

        <Main to={`/b/${content.subreadit.name}/${content.id}`}>
          <Content>{redraft(JSON.parse(content.content), renderers)}</Content>
        </Main>

        <Buttons>
          <Button as={Link} to={`/b/${content.subreadit.name}/${content.id}`}>
            View Post
          </Button>
          <Button type="button">Delete</Button>
        </Buttons>
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

const colors = {
  background: "white",
  primary: "black",
  secondary: "grey",
  border: "grey",
  accent: "red",
  neutral: "rgb(209, 163, 155)",
};

const Container = styled(Link)`
  display: block;
  border: 1px solid ${colors.border};
  background: ${colors.background};
  cursor: pointer;

  &:hover {
    border: 1px solid ${colors.neutral};
  }
`;

const Informations = styled.div`
  font-size: 0.75rem;
  color: ${colors.secondary};
`;

const Header = styled(Informations)`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${colors.border};

  & > svg:first-child {
    margin-right: 1rem;
  }
`;

const Main = styled(Link)`
  display: flex;
  padding: 1rem;
`;

const Content = styled.div``;

const UnderlineLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;

const PostLink = styled(Link)`
  color: ${colors.primary};
`;

const AccentLink = styled(UnderlineLink)`
  color: ${colors.accent};
`;

const StrongLink = styled(UnderlineLink)`
  font-weight: 500;
  color: ${colors.primary};
`;

const Buttons = styled.div``;

const Button = styled.button``;
