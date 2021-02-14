import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const colors = {
  accent: "red",
  background: "white",
};

const Container = styled.div`
  padding: 1rem;
  background: ${colors.background};
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
  border: 1px solid ${colors.accent};
  color: ${colors.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
  text-align: center;
`;

const ButtonFilled = styled(Button)`
  color: ${colors.background};
  background-color: ${colors.accent};
  border: 1px solid ${colors.accent};
`;

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
