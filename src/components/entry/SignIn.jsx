import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useSignIn from "../../hooks/useSignIn";

const Field = styled.div``;

const Label = styled.label`
  position: absolute;
  top: -9999px;
`;

const Input = styled.input``;

const Message = styled.div``;

const SmallFont = styled(Message)``;

const Button = styled.button``;

const ChangeTab = styled.button``;

function SignIn({ changeTab }) {
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

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignIn();
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
          <Message>{emailError}</Message>
        </Field>

        <Field>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Message>{passwordError}</Message>
        </Field>

        <Button type="submit">Log In</Button>
        <Message>{message}</Message>
      </form>

      <SmallFont>
        Forgot your
        <ChangeTab type="button" onClick={() => changeTab("forgotPassword")}>
          password
        </ChangeTab>
        ?
      </SmallFont>

      <Message>
        New to breadit ?
        <ChangeTab type="button" onClick={() => changeTab("signUp")}>
          Sign up
        </ChangeTab>
      </Message>
    </>
  );
}

SignIn.propTypes = {
  changeTab: PropTypes.func,
};

SignIn.defaultProps = {
  changeTab: () => {},
};

export default SignIn;
