/* eslint-disable react/display-name */
import React from "react";
import redraft from "redraft";
import PropTypes from "prop-types";
import styled from "styled-components";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";
import { renderers } from "../TextEditor";

// Icon
import { ReactComponent as IconComment } from "../../assets/icons/general/icon-comment.svg";

function Comment({ author, content, date, post, id }) {
  return (
    <article>
      <Container to={`/b/${post.subreadit.name}/${post.id}/${id}`}>
        <TopInformations>
          <IconComment />
          <AccentLink to={`/u/${author.id}`}>
            {author.name}
            &nbsp;
          </AccentLink>
          commented on&nbsp;
          <PostLink to={`/b/${post.subreadit.name}/${post.id}`}>
            {post.title}
          </PostLink>
          &nbsp;•&nbsp;
          <StrongLink to={`/b/${post.subreadit.name}`}>
            b/
            {post.subreadit.name}
          </StrongLink>
          &nbsp;• Posted by&nbsp;
          <UnderlineLink to={`/u/${post.author.id}`}>
            {post.author.name}
          </UnderlineLink>
        </TopInformations>

        <Main>
          <div>
            <Informations>
              <StrongLink to={`/u/${author.id}`}>{author.name}</StrongLink>
              &nbsp;•&nbsp;
              {formatDistanceStrict(new Date(date.seconds * 1000), new Date())}
              &nbsp;ago
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

const TopInformations = styled(Informations)`
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
