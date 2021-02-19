import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Nav({ userId }) {
  return (
    <UserNav>
      <NavLink to={`/u/${userId}`}>Overview</NavLink>
      <NavLink to={`/u/${userId}/posts`}>Posts</NavLink>
      <NavLink to={`/u/${userId}/comments`}>Comments</NavLink>
    </UserNav>
  );
}

export default Nav;

const UserNav = styled.nav`
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
  userId: PropTypes.string.isRequired,
};
