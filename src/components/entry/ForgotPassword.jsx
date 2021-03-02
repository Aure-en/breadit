import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useForgotPassword from "../../hooks/useForgotPassword";

function ForgotPassword({ changeTab }) {
  const {
    email,
    setEmail,
    emailError,
    message,
    handleForgotPassword,
  } = useForgotPassword();

  return (
    <>
      <h3>Forgot your password?</h3>
      <div>Enter your email address below so we can reset it.</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleForgotPassword();
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

        <Button type="submit">Reset Password</Button>
        <MessageSuccess>{message}</MessageSuccess>
      </form>

      <Message>
        {changeTab ? (
          <>
            <ChangeTab type="button" onClick={() => changeTab("signIn")}>
              Log In
            </ChangeTab>
            <span> • </span>
            <ChangeTab type="button" onClick={() => changeTab("signUp")}>
              Sign Up
            </ChangeTab>
          </>
        ) : (
          <>
            <ChangeTab as={Link} to="/entry/signin">
              Log In
            </ChangeTab>
            <span> • </span>
            <ChangeTab as={Link} to="/entry/signup">
              Sign Up
            </ChangeTab>
          </>
        )}
      </Message>
    </>
  );
}

ForgotPassword.propTypes = {
  changeTab: PropTypes.func,
};

ForgotPassword.defaultProps = {
  changeTab: null,
};

export default ForgotPassword;

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
