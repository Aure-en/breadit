import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
import Nav from "../../components/subreadit/Nav";
import Header from "../../components/subreadit/Header";
import Posts from "./Posts";
import Information from "./Information";

function Subreadit({ match }) {
  const subreaditName = match.params.subreadit;
  const { windowSize } = useWindowSize();

  return (
    <Container>
      <Header subreaditName={subreaditName} />
      {windowSize.width <= 992 && <Nav subreaditName={subreaditName} />}

      <Switch>
        <Route
          exact
          path={`/b/${subreaditName}`}
          render={() => <Posts subreaditName={subreaditName} />}
        />

        <Route
          exact
          path={`/b/${subreaditName}/about`}
          render={() => <Information subreaditName={subreaditName} />}
        />
      </Switch>
    </Container>
  );
}

Subreadit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subreadit: PropTypes.string,
    }),
  }).isRequired,
};

export default Subreadit;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
