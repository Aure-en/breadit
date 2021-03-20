import React from "react";
import styled from "styled-components";
import { useEntry } from "../../../contexts/EntryContext";

function SignToComment() {
  const { openSignIn, openSignUp } = useEntry();
  return (
    <Container>
      <div>Log in or sign up to leave a comment</div>
      <Buttons>
        <Button type="button" onClick={openSignIn}>
          Log In
        </Button>
        <ButtonFilled type="button" onClick={openSignUp}>
          Sign Up
        </ButtonFilled>
      </Buttons>
    </Container>
  );
}

export default SignToComment;

const Container = styled.div`
  border: 1px solid ${(props) => props.theme.border};
  display: flex;
  padding: 0.5rem;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  margin: 0 1rem;

  & > button:first-child {
    margin-right: 1rem;
  }
`;

const Button = styled.button`
  border: 1px solid ${(props) => props.theme.header_text};
  color: ${(props) => props.theme.header_text};
  border-radius: 5rem;
  padding: 0.35rem 1.25rem;
  font-weight: 500;
  text-align: center;

  &:hover {
    color: ${(props) => props.theme.header_text_active};
    border: 1px solid ${(props) => props.theme.header_text_active};
  }
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.header_bg};
  background-color: ${(props) => props.theme.header_text};
  border: 1px solid ${(props) => props.theme.header_text};
  opacity: 0.95;

  &:hover {
    color: ${(props) => props.theme.header_bg};
    background-color: ${(props) => props.theme.header_text_active};
    border: 1px solid ${(props) => props.theme.header_text_active};
    opacity: 1;
  }
`;
