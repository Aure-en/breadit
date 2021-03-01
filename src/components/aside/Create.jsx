import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Create() {
  return (
    <Container>
      <Heading>Home</Heading>
      <p>
        Your personal Breadit frontpage.
        <br />
        Come here to check in with your favorite communities.
      </p>
      <ButtonFilled to="/submit">Create Post</ButtonFilled>
      <Button to="/create/subreadit">Create Community</Button>
    </Container>
  );
}

export default Create;

const Container = styled.div`
  padding: 1rem;
  background: ${(props) => props.theme.backgroundSecondary};
  line-height: 1.25rem;
  border-radius: 5px;

  & > * {
    margin-bottom: 1rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

const Heading = styled.h3`
  font-size: 1rem;
`;

const Button = styled(Link)`
  display: block;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
  text-align: center;
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.backgroundSecondary};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
`;
