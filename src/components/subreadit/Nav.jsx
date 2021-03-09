import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

function Nav({ subreaditName }) {
  const location = useLocation();

  return (
    <Wrapper>
      <Container>
        <NavLink
          to={`/b/${subreaditName}`}
          isSelected={location.pathname === `/b/${subreaditName}`}
        >
          Posts
        </NavLink>
        <NavLink
          to={`/b/${subreaditName}/about`}
          isSelected={location.pathname === `/b/${subreaditName}/about`}
        >
          About
        </NavLink>
      </Container>
    </Wrapper>
  );
}

export default Nav;

const Wrapper = styled.div`
  width: 100%;
  background: ${(props) => props.theme.backgroundSecondary};
  border-bottom: 1px solid ${(props) => props.theme.accentSoft};

  @media all and (min-width: 992px) {
    grid-row: 1;
    grid-column: 1 / -1;
    justify-content: center;
  }
`;

const Container = styled.nav`
  display: flex;
  justify-content: space-around;
  padding-top: 0.5rem;
  background: ${(props) => props.theme.backgroundSecondary};
  margin: 0 auto;
  max-width: 20rem;

  & > * {
    flex: 1;
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
  subreaditName: PropTypes.string.isRequired,
};
