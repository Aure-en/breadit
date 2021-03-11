import React from "react";
import styled from "styled-components";
import { Switch, Route, Link } from "react-router-dom";
import Nav from "../../../components/inbox/messages/Nav";
import Received from "./Received";
import Sent from "./Sent";

function Messages() {
  return (
    <>
      <Header>
        <Nav />
        <StyledLink to="/message/compose">Send a message</StyledLink>
      </Header>
      <Switch>
        <Route exact path="/inbox/messages/sent" component={Sent} />
        <Route path="/inbox/messages" component={Received} />
      </Switch>
    </>
  );
}

export default Messages;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 1rem;

  @media all and (min-width: 40rem) {
    width: 100vw;
    max-width: 38rem;
  }
`;

const StyledLink = styled(Link)`
  font-weight: 500;
  color: ${(props) => props.theme.secondary};
  text-transform: uppercase;
  font-size: 0.75rem;

  &:hover {
    color: ${(props) => props.theme.accent};
  }
`;