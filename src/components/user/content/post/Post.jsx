import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { useAuth } from "../../../../contexts/AuthContext";
import Vote from "../../../content/shared/Vote";
import Buttons from "./Buttons";

// Icons
import { ReactComponent as IconPost } from "../../../../assets/icons/general/icon-post.svg";
import { ReactComponent as IconLink } from "../../../../assets/icons/general/icon-link.svg";

function Post({ author, id, title, subreadit, type, content, date }) {
  const { currentUser } = useAuth();
  const [isHidden, setIsHidden] = useState(false);

  return (
    <>
      {!isHidden && (
        <Link to={`/b/${subreadit.name}/${id}`}>
          <Container>
            <VoteContainer>
              <Vote type="posts" docId={id} user={currentUser} />
            </VoteContainer>

            <Preview to={`/b/${subreadit.name}/${id}`}>
              {type === "link" && <IconLink />}
              {type === "post" && <IconPost />}
              {type === "image" && <Image src={content[0]} alt={title} />}
            </Preview>

            <Information>
              <SubreaditLink to={`/b/${subreadit.name}`}>
                b/
                {subreadit.name}
              </SubreaditLink>
              {" • "}
              Posted by{" "}
              <StyledLink to={`/u/${author.name}`}>{author.name}</StyledLink>
              {" • "}
              <StyledLink to={`/b/${subreadit.name}/${id}`}>
                {formatDistanceStrict(
                  new Date(date.seconds * 1000),
                  new Date()
                )}{" "}
                ago
              </StyledLink>
            </Information>

            <Title>{title}</Title>

            <Buttons
              postId={id}
              subreadit={subreadit.name}
              user={currentUser}
              hide={setIsHidden}
            />
          </Container>
        </Link>
      )}
    </>
  );
}

Post.propTypes = {
  author: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
  subreadit: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  date: PropTypes.shape({
    seconds: PropTypes.number,
  }).isRequired,
};

export default Post;

const Container = styled.article`
  display: grid;
  grid-template: repeat(3, auto) / repeat(2, auto) 1fr;
  padding: 0.5rem;
  background: ${(props) => props.theme.bg_container};
  cursor: pointer;
  box-shadow: 0 2px 3px -4px ${(props) => props.theme.shadow};
  border-bottom: 1px solid ${(props) => props.theme.border};
  border-top: 1px solid ${(props) => props.theme.border};
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;

  &:hover {
    border-bottom: 1px solid ${(props) => props.theme.border_active};
    border-top: 1px solid ${(props) => props.theme.border_active};
  }

  @media all and (min-width: 40rem) {
    border-radius: 5px;
    border: 1px solid ${(props) => props.theme.border};

    &:hover {
      border: 1px solid ${(props) => props.theme.border_active};
    }
  }
`;

const VoteContainer = styled.div`
  @media all and (min-width: 768px) {
    grid-row: 1 / -1;
    grid-column: 1;
  }
`;

const Preview = styled(Link)`
  width: 5rem;
  height: 3.5rem;
  min-width: 4rem;
  min-height: 3rem;
  border: 1px solid ${(props) => props.theme.text_secondary};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-row: 1 / -1;
  grid-column: 1;
  justify-self: center;
  margin-right: 1rem;

  @media all and (min-width: 768px) {
    width: 5rem;
    height: 3.5rem;
    min-width: 5rem;
    min-height: 3.5rem;
    grid-column: 2;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.25rem;
  grid-row: 2;
  grid-column: 2 / -1;

  @media all and (min-width: 768px) {
    grid-column: 3;
  }
`;

const Information = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.text_secondary};
  grid-row: 1;
  grid-column: 2 / -1;

  @media all and (min-width: 768px) {
    grid-column: 3;
  }
`;

const SubreaditLink = styled(Link)`
  font-weight: 500;
  color: ${(props) => props.theme.text_primary};

  &:hover {
    text-decoration: underline;
  }
`;

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;
