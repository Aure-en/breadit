import React from "react";
import redraft from "redraft";
import PropTypes from "prop-types";
import styled from "styled-components";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";
import { renderers } from "../../shared/TextEditor";

// Icon
import { ReactComponent as IconComment } from "../../../assets/icons/general/icon-comment.svg";

function Comment({ author, content, date, post, id }) {
  return (
    <article>
      <Container to={`/b/${post.subreadit.name}/${post.id}/${id}`}>
        <Header>
          <IconComment />
          <AccentLink to={`/u/${author.id}`}>
{author.name}
{' '}
 </AccentLink>
          commented on
{" "}
          <PostLink to={`/b/${post.subreadit.name}/${post.id}`}>
            {post.title}
          </PostLink>
          {" • "}
          <StrongLink to={`/b/${post.subreadit.name}`}>
            b/
            {post.subreadit.name}
          </StrongLink>
          {"\u00A0"}
• Posted by{" "}
          <UnderlineLink to={`/u/${post.author.id}`}>
            {post.author.name}
          </UnderlineLink>
        </Header>

        <Main>
          <div>
            <Informations>
              <StrongLink to={`/u/${author.id}`}>{author.name}</StrongLink>
              {" • "}
              {formatDistanceStrict(
                new Date(date.seconds * 1000),
                new Date()
              )}
{" "}
              ago
            </Informations>
            <Content>{redraft(JSON.parse(content), renderers)}</Content>
          </div>
        </Main>
      </Container>
    </article>
  );
}

Comment.propTypes = {
  author: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  content: PropTypes.string.isRequired,
  date: PropTypes.shape({
    seconds: PropTypes.number,
  }).isRequired,
  id: PropTypes.string.isRequired,
  post: PropTypes.shape({
    id: PropTypes.string,
    author: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    subreadit: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    title: PropTypes.string,
  }).isRequired,
};

export default Comment;

const Container = styled(Link)`
  display: block;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.backgroundSecondary};
  cursor: pointer;

  &:hover {
    border: 1px solid ${(props) => props.theme.borderHover};
  }
`;

const Informations = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.secondary};
`;

const Header = styled(Informations)`
  padding: 0.5rem;
  border-bottom: 1px solid ${(props) => props.theme.border};

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
    border-left: 2px solid ${(props) => props.theme.accentSoft};
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
  color: ${(props) => props.theme.primary};
`;

const AccentLink = styled(UnderlineLink)`
  color: ${(props) => props.theme.accent};
`;

const StrongLink = styled(UnderlineLink)`
  font-weight: 500;
  color: ${(props) => props.theme.primary};
`;
