import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Nav({ username }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  return (
    <Container>
      <NavLink
        to={`/u/${username}`}
        isSelected={location.pathname === `/u/${username}`}
      >
        Overview
      </NavLink>
      <NavLink
        to={`/u/${username}/posts`}
        isSelected={location.pathname === `/u/${username}/posts`}
      >
        Posts
      </NavLink>
      <NavLink
        to={`/u/${username}/comments`}
        isSelected={location.pathname === `/u/${username}/comments`}
      >
        Comments
      </NavLink>
      {currentUser.uid === username && (
        <NavLink
          to={`/u/${username}/saved`}
          isSelected={location.pathname === `/u/${username}/saved`}
        >
          Saved
        </NavLink>
      )}
    </Container>
  );
}

export default Nav;

const Container = styled.nav`
  display: flex;
  justify-content: space-around;
  background: ${(props) => props.theme.backgroundSecondary};
  border: 1px solid ${(props) => props.theme.neutral};
  margin: 1rem 0;

  & > * {
    flex: 1;
  }
`;

const NavLink = styled(Link)`
  flex: 1;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${(props) => props.isSelected && "500"};
  color: ${(props) => props.isSelected && props.theme.accent};
  border-bottom: ${(props) =>
    props.isSelected
      ? `2px solid ${props.theme.accent}`
      : "2px solid transparent"};

  & > *:first-child {
    margin-right: 0.5rem;
  }
`;

Nav.propTypes = {
  username: PropTypes.string.isRequired,
};
