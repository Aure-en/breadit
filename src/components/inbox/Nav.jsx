import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <Container>
      <NavLink to="/inbox">Overview</NavLink>
      <NavLink to="/inbox/notifications">Notifications</NavLink>
      <NavLink to="/inbox/messages">Messages</NavLink>
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
