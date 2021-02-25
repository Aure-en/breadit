import React from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";
import Nav from "../../components/inbox/Nav";
import Overview from "./Overview";
import Messages from "./Messages";
import Notifications from "./Notifications";

function Inbox() {
  return (
    <Wrapper>
      <Container>
        <Nav />
        <Switch>
          <Route exact path="/inbox" component={Overview} />
          <Route exact path="/inbox/notifications" component={Notifications} />
          <Route exact path="/inbox/messages" component={Messages} />
        </Switch>
      </Container>
    </Wrapper>
  );
}

export default Inbox;

const colors = {
  background: "rgb(241, 236, 230)",
};

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: ${colors.background};
  padding: 3rem;
  height: 100%;
  flex: 1;
`;

const Container = styled.div`
  flex: 1;
  max-width: 40rem;
`;
