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
  padding-top: .5rem;
  background: ${(props) => props.theme.backgroundSecondary};

  & > * {
    flex: 1;
  }

  @media all and (min-width: 992px) {
    grid-row: 1;
    grid-column: 1 / -1;
    justify-content: center;

    & > * {
      flex: initial;
      min-width: 7.5rem;
    }
  }
`;

const NavLink = styled(Link)`
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
