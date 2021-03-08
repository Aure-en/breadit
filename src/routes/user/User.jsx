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
    <Container>
      <Profile username={match.params.username} />
      <Nav username={match.params.username} />
      <Content>
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
          <Route
            exact
            path={`${match.path}/saved`}
            render={() => <Saved username={match.params.username} />}
          />
        </Switch>
      </Content>
    </Container>
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
  display: flex;
  flex-direction: column;
  flex: 1;
  width: calc(100vw - 16px);
  max-width: 100%;

  @media all and (min-width: 992px) {
    display: grid;
    grid-template: auto 1fr / 1fr repeat(2, auto) 1fr;
    grid-column-gap: 2vw;
    grid-row-gap: 1rem;
    align-items: start;
  }

  @media all and (min-width: 1005px) {
    grid-column-gap: 3vw;
  }
`;

const Content = styled.div`
  @media all and (min-width: 40rem) {
    max-width: 40rem;
    grid-column: 2;
    align-self: center;
  }

  @media all and (min-width: 992px) {
    align-self: initial;
  }
`;
