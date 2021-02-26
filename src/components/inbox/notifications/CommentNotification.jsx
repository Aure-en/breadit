import React from "react";
import redraft from "redraft";
import PropTypes from "prop-types";
import styled from "styled-components";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";
import { renderers } from "../../TextEditor";
import useNotification from "../../../hooks/useNotification";

function CommentNotification({ id, type, date, content, post }) {
  const { deleteNotification } = useNotification();

  return (
    <article>
      <Container to={`/b/${post.subreadit.name}/${post.id}`}>
        <Header>
          <AccentLink to={`/u/${content.author.name}`}>
            {content.author.name}
            &nbsp;
          </AccentLink>
          <span>
            {type === "comment" && "commented on your post"}
            {type === "reply" && "replied to your comment on"}
            {type === "mention" && "mentioned you on"}
            &nbsp;
          </span>
          <PostLink to={`/b/${post.subreadit.name}/${post.id}`}>
            {post.title}
          </PostLink>
          <span>&nbsp;•&nbsp;</span>
          <StrongLink to={`/b/${post.subreadit.name}`}>
            b/
            {post.subreadit.name}
          </StrongLink>
          &nbsp;• Posted by&nbsp;
          <UnderlineLink to={`/u/${post.author.id}`}>
            {post.author.name}
          </UnderlineLink>
          <span> • </span>
          <UnderlineLink to={`/b/${post.subreadit.name}/${post.id}`}>
            {formatDistanceStrict(new Date(date.seconds * 1000), new Date())}
          </UnderlineLink>
        </Header>

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
            <Content>{redraft(JSON.parse(content.content), renderers)}</Content>
          </div>

          <Buttons>
            <Button as={Link} to={`/b/${post.subreadit.name}/${post.id}`}>
              View Post
            </Button>
            <Button type="button" onClick={() => deleteNotification(id)}>
              Delete
            </Button>
          </Buttons>
        </Main>
      </Container>
    </article>
  );
}

export default CommentNotification;

CommentNotification.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  document: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
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
  }),
};

CommentNotification.defaultProps = {
  post: null,
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

const Main = styled.div`
  display: flex;
  padding: 1rem;

  &:before {
    display: block;
    content: "";
    align-self: stretch;
    border-left: 3px dashed ${colors.border};
    margin-right: 1rem;
  }
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
