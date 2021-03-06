import React from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";
import Nav from "../../components/inbox/Nav";
import Overview from "./Overview";
import Messages from "./messages/Messages";
import Notifications from "./Notifications";

function Inbox() {
  return (
    <>
      <Container>
        <Nav />
        <Content>
          <Switch>
            <Route exact path="/inbox" component={Overview} />
            <Route
              exact
              path="/inbox/notifications"
              component={Notifications}
            />
            <Route path="/inbox/messages" component={Messages} />
          </Switch>
        </Content>
      </Container>
    </>
  );
}

export default Inbox;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  @media all and (min-width: 576px) {
    max-width: 40rem;
    align-self: center;
  }
`;
