import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";
import useUser from "../../../hooks/useUser";
import { BREADITOR_AVATAR } from "../../../utils/const";

function Information({ author, date, isDeleted, isPostAuthor }) {
  const [user, setUser] = useState();
  const { getUser } = useUser();

  // Gets the author informations (avatar, karma...)
  useEffect(() => {
    if (isDeleted) return;
    (async () => {
      const user = await getUser(author.id);
      setUser(user.data());
    })();
  }, []);

  return (
    <Container>
      {user ? (
        <Icon src={user.avatar} alt={`${author.name}'s avatar`} />
      ) : (
        <Icon src={BREADITOR_AVATAR} alt="Default Breaditor Avatar" />
      )}

      {isDeleted ? (
        <div>[deleted]</div>
      ) : (
        <AuthorLink to={`/u/${author.name}`} isPostAuthor={isPostAuthor}>{author.name}</AuthorLink>
      )}

      <Secondary>
        <span>&nbsp;•&nbsp;</span>
        {formatDistanceStrict(new Date(date.seconds * 1000), new Date())}{" "}
      </Secondary>
    </Container>
  );
}

export default Information;

Information.propTypes = {
  author: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  date: PropTypes.shape({
    seconds: PropTypes.number,
  }).isRequired,
  isDeleted: PropTypes.bool,
  isPostAuthor: PropTypes.bool,
};

Information.defaultProps = {
  isDeleted: false,
  isPostAuthor: false,
};

const Container = styled.div`
  display: flex;
  font-size: 0.75rem;
`;

const Icon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  background: ${(props) => props.theme.header_bg};
`;

const AuthorLink = styled(Link)`
  font-weight: ${(props) => props.isPostAuthor && "500"};
  color: ${(props) => props.isPostAuthor && props.theme.accent};

  &:hover {
    text-decoration: underline;
  }
`;

const Secondary = styled.div`
  color: ${(props) => props.theme.text_secondary};
`;
