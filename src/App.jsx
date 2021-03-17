import React from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GlobalStyles from "./styles/global/globalStyles";
import { AuthProvider } from "./contexts/AuthContext";
import { EntryProvider } from "./contexts/EntryContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { SaveProvider } from "./contexts/SaveContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import useWindowSize from "./hooks/useWindowSize";
import PrivateRoute from "./routes/PrivateRoute";
import CreateSubreadit from "./routes/create/CreateSubreadit";
import CreatePost from "./routes/create/CreatePost";
import CreateMessage from "./routes/create/CreateMessage";
import All from "./routes/feeds/All";
import Subreadit from "./routes/subreadit/Subreadit";
import Main from "./routes/feeds/Main";
import Post from "./routes/content/Post";
import Comment from "./routes/content/Comment";
import Header from "./components/header/desktop/Header";
import HeaderMobile from "./components/header/mobile/Header";
import UserSettings from "./routes/user/Settings";
import SubreaditSettings from "./routes/subreadit/Settings";
import User from "./routes/user/User";
import Inbox from "./routes/inbox/Inbox";
import NotFound from "./routes/NotFound";
import Entry from "./components/entry/Entry";
import Toast from "./components/shared/Toast";
import "normalize.css";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media all and (min-width: 768px) {
    min-height: 100vh;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  flex: 1;
`;

Modal.setAppElement("#root");
function App() {
  const { windowSize } = useWindowSize();

  return (
    <Router>
      <ThemeProvider>
        <GlobalStyles />
        <Wrapper>
          <AuthProvider>
            <EntryProvider>
              <SubscriptionProvider>
                <SaveProvider>
                  {windowSize.width < 768 ? <HeaderMobile /> : <Header />}

                  <Container>
                    <Switch>
                      <Route exact path="/" component={Main} />
                      <PrivateRoute
                        exact
                        path="/settings"
                        component={UserSettings}
                      />
                      <PrivateRoute
                        exact
                        path="/submit"
                        component={CreatePost}
                      />
                      <PrivateRoute
                        exact
                        path="/create/subreadit"
                        component={CreateSubreadit}
                      />
                      <PrivateRoute
                        exact
                        path="/message/compose"
                        component={CreateMessage}
                      />
                      <Route exact path="/b/all" component={All} />
                      <Route
                        exact
                        path={["/b/:subreadit", "/b/:subreadit/about"]}
                        component={Subreadit}
                      />
                      <PrivateRoute
                        exact
                        path="/b/:subreadit/settings"
                        component={SubreaditSettings}
                      />
                      <Route
                        exact
                        path="/b/:subreadit/:postId"
                        component={Post}
                      />
                      <Route
                        exact
                        path="/b/:subreadit/:postId/:commentId"
                        component={Comment}
                      />
                      <Route path="/u/:username" component={User} />
                      <PrivateRoute path="/inbox" component={Inbox} />
                      <Route component={NotFound} />
                    </Switch>
                  </Container>
                  <Entry />
                  <Toast />
                </SaveProvider>
              </SubscriptionProvider>
            </EntryProvider>
          </AuthProvider>
        </Wrapper>
      </ThemeProvider>
    </Router>
  );
}

export default App;
