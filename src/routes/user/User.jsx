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
    <Wrapper>
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
    </Wrapper>
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
