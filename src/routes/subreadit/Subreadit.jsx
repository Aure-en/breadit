import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
import useSubreadit from "../../hooks/useSubreadit";
import Nav from "../../components/subreadit/Nav";
import Header from "../../components/subreadit/Header";
import Nonexistent from "../../components/subreadit/Nonexistent";
import Posts from "./Posts";
import Information from "./Information";

function Subreadit({ match }) {
  const subreaditName = match.params.subreadit;
  const [subreadit, setSubreadit] = useState();
  const [loading, setLoading] = useState(true);
  const { windowSize } = useWindowSize();
  const { getSubreaditByName } = useSubreadit();

  useEffect(() => {
    (async () => {
      const subreadit = await getSubreaditByName(subreaditName);
      setSubreadit(subreadit);
      setLoading(false);
    })();
  }, [match]);

  return (
    <>
      {!loading && (
        <>
          {subreadit ? (
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
          ) : (
            <Nonexistent />
          )}
        </>
      )}
    </>
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
