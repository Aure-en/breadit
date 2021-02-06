import React from "react";
import Modal from "react-modal";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import CreateSubreadit from "./routes/create/CreateSubreadit";
import Main from "./routes/Main";
import Post from "./routes/Post";
import All from "./routes/All";
import Subreadit from "./routes/Subreadit";
import CreatePost from "./routes/create/CreatePost";
import Nav from "./components/Nav";
import Settings from "./routes/settings/Settings";

Modal.setAppElement("#root");
function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <header>
            <Nav />
          </header>

          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="/submit" component={CreatePost} />
            <Route exact path="/create/subreadit" component={CreateSubreadit} />
            <Route exact path="/b/all" component={All} />
            <Route exact path="/b/:subreadit" component={Subreadit} />
            <Route exact path="/b/:subreadit/:postId" component={Post} />
          </Switch>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
