import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useSignUp from "../../hooks/useSignUp";

function SignUp({ changeTab }) {
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
        <>
          {changeTab ? (
            <ChangeTab type="button" onClick={() => changeTab("signIn")}>
              Log In
            </ChangeTab>
          ) : (
            <ChangeTab as={Link} to="/entry/signin">
              Log In
            </ChangeTab>
          )}
        </>
      </Message>

      <MessageSuccess>{message}</MessageSuccess>
    </>
  );
}

SignUp.propTypes = {
  changeTab: PropTypes.func,
};

SignUp.defaultProps = {
  changeTab: null,
};

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
      props.hasError ? props.theme.error : props.theme.borderSecondary};

  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.accent};
  }

  &::placeholder {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 0.75rem;
  }
`;

const Message = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.secondary};
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
  color: ${(props) => props.theme.backgroundSecondary};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
  text-align: center;
  margin: 0.75rem 0;

  &:disabled {
    background-color: ${(props) => props.theme.accentDisabled};
    border: 1px solid ${(props) => props.theme.accentDisabled};
    cursor: disabled;
  }
`;

const ChangeTab = styled.button`
  color: ${(props) => props.theme.accent};
`;
