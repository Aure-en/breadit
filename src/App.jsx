import React from "react";
import Modal from "react-modal";
import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GlobalStyles from "./styles/global/globalStyles";
import light from "./styles/themes/light";
import { AuthProvider } from "./contexts/AuthContext";
import { EntryProvider } from "./contexts/EntryContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { SaveProvider } from "./contexts/SaveContext";
import useWindowSize from "./hooks/useWindowSize";
import CreateSubreadit from "./routes/create/CreateSubreadit";
import CreatePost from "./routes/create/CreatePost";
import CreateMessage from "./routes/create/CreateMessage";
import All from "./routes/feeds/All";
import Subreadit from "./routes/feeds/Subreadit";
import Main from "./routes/feeds/Main";
import Post from "./routes/content/Post";
import Comment from "./routes/content/Comment";
import Header from "./components/header/desktop/Header";
import HeaderMobile from "./components/header/mobile/Header";
import UserSettings from "./routes/settings/UserSettings";
import SubreaditSettings from "./routes/settings/SubreaditSettings";
import User from "./routes/user/User";
import Inbox from "./routes/inbox/Inbox";
import Entry from "./components/entry/Entry";
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
      <ThemeProvider theme={light}>
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
                      <Route exact path="/settings" component={UserSettings} />
                      <Route exact path="/submit" component={CreatePost} />
                      <Route
                        exact
                        path="/create/subreadit"
                        component={CreateSubreadit}
                      />
                      <Route
                        exact
                        path="/message/compose"
                        component={CreateMessage}
                      />
                      <Route exact path="/b/all" component={All} />
                      <Route exact path="/b/:subreadit" component={Subreadit} />
                      <Route
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
                      <Route path="/inbox" component={Inbox} />
                    </Switch>
                  </Container>
                  <Entry />
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
