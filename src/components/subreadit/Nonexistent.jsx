import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Nonexistent() {
  return (
    <Container>
      <h4>Sorry, there aren't any communities here.</h4>
      <div>The community may have been deleted or the name is incorrect.</div>
      <Row>
        <ButtonFilled to="/create/subreadit">Create Subreadit</ButtonFilled>
        <Button to="/b/all">Explore Subreadits</Button>
      </Row>
    </Container>
  );
}

export default Nonexistent;

const Container = styled.div`
  margin-top: 0.5rem;
  width: 100vw;
  max-width: 100%;
  background: ${(props) => props.theme.backgroundSecondary};
  border-bottom: 1px solid ${(props) => props.theme.border};
  border-top: 1px solid ${(props) => props.theme.border};
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  padding: 1rem;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media all and (min-width: 768px) {
    border: 1px solid ${(props) => props.theme.border};
    align-items: center;
    max-width: 40rem;
    align-self: center;
  }
`;

const Button = styled(Link)`
  display: block;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  border-radius: 0.25rem;
  padding: 0.35rem 1.25rem;
  font-weight: 500;
  text-align: center;

  &:hover {
    color: ${(props) => props.theme.accentHover};
    border: 1px solid ${(props) => props.theme.accentHover};
  }
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.backgroundSecondary};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};

  &:hover {
    color: ${(props) => props.theme.backgroundSecondary};
    background-color: ${(props) => props.theme.accentHover};
    border: 1px solid ${(props) => props.theme.accentHover};
  }
`;

const Row = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1rem;
  margin-top: 1rem;
`;
