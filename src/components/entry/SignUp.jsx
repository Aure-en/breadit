import React from "react";
import styled from "styled-components";
import { useEntry } from "../../contexts/EntryContext";
import useSignUp from "../../hooks/useSignUp";

function SignUp() {
  const {
    email,
    setEmail,
    emailError,
    username,
    setUsername,
    usernameError,
    password,
    setPassword,
    passwordError,
    loading,
    checkUsername,
    checkEmail,
    checkPassword,
    handleSignUp,
    message,
  } = useSignUp();
  const { setCurrentTab, closeEntry } = useEntry();

  return (
    <>
      <div>
        <h3>Sign up</h3>
        <div>
          You will be able to vote on posts and comment to help everyone find
          the best content.
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUp(username, email, password);
          setTimeout(() => closeEntry(), 1500);
        }}
      >
        <Field>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={(e) => checkUsername(e.target.value)}
            hasError={usernameError}
          />
          <MessageError>{usernameError}</MessageError>
        </Field>

        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => checkEmail(e.target.value)}
            hasError={emailError}
          />
          <MessageError>{emailError}</MessageError>
        </Field>

        <Field>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={(e) => checkPassword(e.target.value)}
            hasError={passwordError}
          />
          <MessageError>{passwordError}</MessageError>
        </Field>

        <Button type="submit" disabled={loading}>
          Sign Up
        </Button>
      </form>

      <Message>
        Already a breaditor ?{" "}
        <ChangeTab type="button" onClick={() => setCurrentTab("signIn")}>
          Log In
        </ChangeTab>
      </Message>

      <MessageSuccess>{message}</MessageSuccess>
    </>
  );
}

export default SignUp;

const Field = styled.div`
  display: flex;
  flex-direction: column;

  & > * {
    flex: 1;
  }
`;

const Label = styled.label`
  position: absolute;
  top: -9999px;
`;

const Input = styled.input`
  margin: 0.75rem 0 0 0;
  padding: 0.75rem;
  border-radius: 3px;
  border: 1px solid
    ${(props) =>
      props.hasError ? props.theme.error : props.theme.border_secondary};
  background: ${(props) => props.theme.input_bg};
  color: ${(props) => props.theme.text_primary};

  &:focus {
    outline: 1px solid transparent;
    border: 1px solid ${(props) => props.theme.accent};
    background: ${(props) => props.theme.input_bg};
  }

  &::placeholder {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 0.75rem;
  }
`;

const Message = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.text_secondary};
  margin-bottom: 0.5rem;
`;

const MessageError = styled(Message)`
  color: ${(props) => props.theme.error};
  top: -0.5rem;
`;

const MessageSuccess = styled(Message)`
  color: ${(props) => props.theme.success};
  line-height: 1rem;
`;

const Button = styled.button`
  display: block;
  color: ${(props) => props.theme.bg_container};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
  text-align: center;
  margin: 0.75rem 0;

  &:disabled {
    background-color: ${(props) => props.theme.accent_disabled};
    border: 1px solid ${(props) => props.theme.accent_disabled};
    cursor: disabled;
  }

  &:hover {
    color: ${(props) => props.theme.bg_container};
    background-color: ${(props) => props.theme.accent_active};
    border: 1px solid ${(props) => props.theme.accent_active};
  }
`;

const ChangeTab = styled.button`
  color: ${(props) => props.theme.accent};
`;
