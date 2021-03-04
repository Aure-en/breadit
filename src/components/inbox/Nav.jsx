import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

function Nav() {
  const location = useLocation();
  return (
    <Wrapper>
      <Container>
        <NavLink to="/inbox" isSelected={location.pathname === "/inbox"}>
          Overview
        </NavLink>
        <NavLink
          to="/inbox/notifications"
          isSelected={location.pathname === "/inbox/notifications"}
        >
          Notifications
        </NavLink>
        <NavLink
          to="/inbox/messages"
          isSelected={location.pathname === "/inbox/messages"}
        >
          Messages
        </NavLink>
      </Container>
    </Wrapper>
  );
}

export default Nav;

const Wrapper = styled.div`
  width: 100%;
  background: ${(props) => props.theme.backgroundSecondary};
`;

const Container = styled.nav`
  display: flex;
  justify-content: space-around;
  padding-top: 0.5rem;
  background: ${(props) => props.theme.backgroundSecondary};
  margin: 0 auto;
  max-width: 40rem;

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
