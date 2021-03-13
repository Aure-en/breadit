import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEntry } from "../../contexts/EntryContext";
import { useAuth } from "../../contexts/AuthContext";
import { HOME_IMG } from "../../utils/const";

function Create() {
  const { currentUser } = useAuth();
  const { openSignUp } = useEntry();

  return (
    <Container>
      <Heading>
        Home
      </Heading>
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
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 5rem 1rem 1rem 1rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.bg_container};
  box-shadow: 0 0 10px -5px ${(props) => props.theme.shadow};
  line-height: 1.25rem;
  border-radius: 0.25rem;

  & > * {
    margin-bottom: 1rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  &:before {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    height: 5rem;
    width: 100%;
    background: url(${HOME_IMG});
    background-size: cover;
    background-position: 0 67.5%;
    background-repeat: no-repeat;
  }
`;

const Heading = styled.h3`
  font-size: 1rem;
  margin: 1rem 0 0.5rem 0;
`;

const Button = styled.button`
  display: block;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.35rem 1.25rem;
  font-weight: 500;
  text-align: center;

  &:hover {
    color: ${(props) => props.theme.accent_active};
    border: 1px solid ${(props) => props.theme.accent_active};
  }
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.bg_container};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};

  &:hover {
    color: ${(props) => props.theme.bg_container};
    background-color: ${(props) => props.theme.accent_active};
    border: 1px solid ${(props) => props.theme.accent_active};
  }
`;
