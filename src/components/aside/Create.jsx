import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEntry } from "../../contexts/EntryContext";
import { useAuth } from "../../contexts/AuthContext";

function Create() {
  const { currentUser } = useAuth();
  const { openSignUp } = useEntry();

  return (
    <Container>
      <Heading>Home</Heading>
      <p>
        Your personal Breadit frontpage.
        <br />
        Come here to check in with your favorite communities.
      </p>

      {currentUser ? (
        <>
          <ButtonFilled as={Link} to="/submit">
            Create Post
          </ButtonFilled>
          <Button as={Link} to="/create/subreadit">
            Create Community
          </Button>
        </>
      ) : (
        <>
          <ButtonFilled type="button" onClick={openSignUp}>
            Create Post
          </ButtonFilled>
          <Button type="button" onClick={openSignUp}>
            Create Community
          </Button>
        </>
      )}
    </Container>
  );
}

export default Create;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.neutral};
  background: ${(props) => props.theme.backgroundSecondary};
  box-shadow: 0 0 10px -5px ${(props) => props.theme.shadow};
  line-height: 1.25rem;
  border-radius: 0.25rem;

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

const Button = styled.button`
  display: block;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
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
