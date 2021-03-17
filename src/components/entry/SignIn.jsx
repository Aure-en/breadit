import React from "react";
import styled from "styled-components";
import { useEntry } from "../../contexts/EntryContext";
import useSignIn from "../../hooks/useSignIn";

function SignIn() {
  const {
    email,
    setEmail,
    emailError,
    password,
    setPassword,
    passwordError,
    loading,
    message,
    handleSignIn,
  } = useSignIn();
  const { setCurrentTab, closeEntry } = useEntry();

  return (
    <>
      <div>
        <h3>Sign in</h3>
        <div>Welcome back! We are happy to see you again.</div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignIn();
          setTimeout(() => closeEntry(), 1500);
        }}
      >
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            id="email"
            name="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <MessageError>{emailError}</MessageError>
        </Field>

        <Field>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <MessageError>{passwordError}</MessageError>
        </Field>

        <Button type="submit" disabled={loading}>
          Log In
        </Button>
        <MessageSuccess>{message}</MessageSuccess>
      </form>

      <Message>
        Forgot your{" "}
        <ChangeTab
          type="button"
          onClick={() => setCurrentTab("forgotPassword")}
        >
          password
        </ChangeTab>
        ?
      </Message>

      <Message>
        New to breadit ?{" "}
        <ChangeTab type="button" onClick={() => setCurrentTab("signUp")}>
          Sign up
        </ChangeTab>
      </Message>
    </>
  );
}

export default SignIn;

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
