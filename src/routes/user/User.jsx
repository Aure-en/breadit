import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";
import Overview from "./Overview";
import Posts from "./Posts";
import Comments from "./Comments";
import Saved from "./Saved";
import Profile from "../../components/user/aside/Profile";
import Nav from "../../components/user/Nav";

function User({ match }) {
  return (
    <>
      <Container>
        <Nav username={match.params.username} />
        <Switch>
          <Route
            exact
            path={`${match.path}`}
            render={() => <Overview username={match.params.username} />}
          />
          <Route
            exact
            path={`${match.path}/posts`}
            render={() => <Posts username={match.params.username} />}
          />
          <Route
            exact
            path={`${match.path}/comments`}
            render={() => <Comments username={match.params.username} />}
          />
          <Route exact path={`${match.path}/saved`} component={Saved} />
        </Switch>
      </Container>
      <Profile username={match.params.username} />
    </>
  );
}

User.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      username: PropTypes.string,
    }),
  }).isRequired,
};

export default User;

const Container = styled.div`
  flex: 1;
  max-width: 40rem;
`;
