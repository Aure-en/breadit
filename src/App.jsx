import React from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import CreateSubreadit from "./routes/create/CreateSubreadit";
import Main from "./routes/Main";
import Post from "./routes/Post";
import All from "./routes/All";
import Subreadit from "./routes/Subreadit";
import CreatePost from "./routes/create/CreatePost";
import Nav from "./components/Nav";
import UserSettings from "./routes/settings/UserSettings";

const colors = {
  background: "rgb(241, 236, 230)",
};

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1;
`;

Modal.setAppElement("#root");
function App() {
  return (
    <Router>
      <Wrapper>
        <AuthProvider>
          <header>
            <Nav />
          </header>

          <Container>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/settings" component={UserSettings} />
              <Route exact path="/submit" component={CreatePost} />
              <Route
                exact
                path="/create/subreadit"
                component={CreateSubreadit}
              />
              <Route exact path="/b/all" component={All} />
              <Route exact path="/b/:subreadit" component={Subreadit} />
              <Route exact path="/b/:subreadit/:postId" component={Post} />
            </Switch>
          </Container>
        </AuthProvider>
      </Wrapper>
    </Router>
  );
}

export default App;
