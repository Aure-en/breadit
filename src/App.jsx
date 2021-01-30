import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import CreateSubreadit from "./routes/create/CreateSubreadit";
import Main from "./routes/Main";
import Post from "./routes/Post";
import Subreadit from "./routes/Subreadit";

function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/create/subreadit" component={CreateSubreadit} />
            <Route exact path="/s/:name" component={Subreadit} />
            <Route exact path="/:id" component={Post} />
          </Switch>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
