import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link } from "react-router-dom";
import useUser from "../../../hooks/useUser";

function Information({ author, date }) {
  const [user, setUser] = useState();
  const { getUser } = useUser();

  // Gets the author informations (avatar, karma...)
  useEffect(() => {
    (async () => {
      const user = await getUser(author.id);
      setUser(user.data());
    })();
  }, []);

  return (
    <Container>
      {user && <Icon src={user.avatar} alt={`${author.name}'s avatar`} />}
      <AuthorLink to={`/u/${author.name}`}>{author.name}</AuthorLink>

      <Secondary>
        <span>&nbsp;•&nbsp;</span>
        {formatDistanceStrict(new Date(date.seconds * 1000), new Date())}
        {" "}
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
  background: ${(props) => props.theme.backgroundQuaternary};
`;

const AuthorLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;

const Secondary = styled.div`
  color: ${(props) => props.theme.secondary};
`;
