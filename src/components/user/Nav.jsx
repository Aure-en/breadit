import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Nav({ username }) {
  const { currentUser } = useAuth();

  return (
    <Container>
      <NavLink to={`/u/${username}`}>Overview</NavLink>
      <NavLink to={`/u/${username}/posts`}>Posts</NavLink>
      <NavLink to={`/u/${username}/comments`}>Comments</NavLink>
      {currentUser.uid === username && (
        <NavLink to={`/u/${username}/saved`}>Saved</NavLink>
      )}
    </Container>
  );
}

export default Nav;

const Container = styled.nav`
  display: flex;

  & > * {
    flex: 1;
  }
`;

const NavLink = styled(Link)`
  text-transform: uppercase;
  text-align: center;
`;

Nav.propTypes = {
  username: PropTypes.string.isRequired,
};
