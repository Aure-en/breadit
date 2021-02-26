import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <Container>
      <NavLink to="/inbox/messages">Inbox</NavLink>
      <NavLink to="/inbox/messages/sent">Sent</NavLink>
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
