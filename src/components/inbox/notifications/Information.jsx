import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { formatDistanceStrict } from "date-fns";

function Information({ type, author, subreadit, post, date }) {
  return (
    <Container>
      <AccentLink to={`/u/${author}`}>{author}</AccentLink>
      <span>
        {type === "comment" && " commented on your post "}
        {type === "reply" && " replied to your comment on "}
        {type === "mention" && " mentioned you on "}
      </span>
      <PostLink to={`/b/${subreadit}/${post.id}`}>{post.title}</PostLink>
      <span>{" • "}</span>
      <StrongLink to={`/b/${subreadit}`}>
        b/
        {subreadit}
      </StrongLink>
      <span>{" • Posted by "}</span>
      <UnderlineLink to={`/u/${post.author.id}`}>
        {post.author.name}
      </UnderlineLink>
      <span>{" • "}</span>
      <UnderlineLink to={`/b/${subreadit}/${post.id}`}>
        {formatDistanceStrict(new Date(date.seconds * 1000), new Date())} ago
      </UnderlineLink>
    </Container>
  );
}

export default Information;

Information.propTypes = {
  type: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  subreadit: PropTypes.string.isRequired,
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
};

const Container = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.secondary};
`;

const UnderlineLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;

const PostLink = styled(Link)`
  color: ${(props) => props.theme.primary};
`;

const StrongLink = styled(PostLink)`
  font-weight: 500;
`;

const AccentLink = styled(Link)`
  color: ${(props) => props.theme.accent};
`;
