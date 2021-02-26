import React from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";
import Nav from "../../../components/inbox/messages/Nav";
import Received from "./Received";
import Sent from "./Sent";

function Messages() {
  return (
    <Container>
      <Nav />
      <Switch>
        <Route exact path="/inbox/messages/sent" component={Sent} />
        <Route path="/inbox/messages" component={Received} />
      </Switch>
    </Container>
  );
}

export default Messages;

const Container = styled.div`
  flex: 1;
  max-width: 40rem;
`;
