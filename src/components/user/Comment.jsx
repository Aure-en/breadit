/* eslint-disable react/display-name */
import React from "react";
import redraft from "redraft";
import PropTypes from "prop-types";
import styled from "styled-components";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";

// Icon
import { ReactComponent as IconComment } from "../../assets/icons/general/icon-comment.svg";

const renderers = {
  inline: {
    // The key passed here is just an index based on rendering order inside a block
    BOLD: (children, { key }) => <strong key={key}>{children}</strong>,
    ITALIC: (children, { key }) => <em key={key}>{children}</em>,
    UNDERLINE: (children, { key }) => <u key={key}>{children}</u>,
    CODE: (children, { key }) => (
      <span key={key} className="code">
        {children}
      </span>
    ),
    HEADING: (children, { key }) => (
      <div className="heading" key={key}>
        {children}
      </div>
    ),
    STRIKETHROUGH: (children, { key }) => (
      <span key={key} className="strikethrough">
        {children}
      </span>
    ),
  },
  blocks: {
    unstyled: (children, { key }) =>
      children.map((child) => (
        <div key={key} className="block">
          {child}
        </div>
      )),
    codeBlock: (children, { key }) =>
      children.map((child) => (
        <pre key={key} className="codeBlock">
          {child}
        </pre>
      )),
    quoteBlock: (children, { key }) =>
      children.map((child) => (
        <div key={key} className="quoteBlock">
          {child}
        </div>
      )),
    "unordered-list-item": (children, { keys }) => (
      <ul key={keys[keys.length - 1]}>
        {children.map((child) => (
          <li key={keys[keys.length - 1]}>{child}</li>
        ))}
      </ul>
    ),
    "ordered-list-item": (children, { keys }) => (
      <ol key={keys.join("|")}>
        {children.map((child, index) => (
          <li key={keys[index]}>{child}</li>
        ))}
      </ol>
    ),
  },
};

function Comment({ author, content, date, post }) {
  return (
    <Container>
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

const Container = styled.article`
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
