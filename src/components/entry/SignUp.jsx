import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useSignUp from "../../hooks/useSignUp";

const Field = styled.div``;

const Label = styled.label`
  position: absolute;
  top: -9999px;
`;

const Input = styled.input``;

const Message = styled.div``;

const Button = styled.button``;

const ChangeTab = styled.button``;

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
  } = useSignUp();

  return (
    <>
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
          />
          <Message>{usernameError}</Message>
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
          />
          <Message>{emailError}</Message>
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
          />
          <Message>{passwordError}</Message>
        </Field>

        <Button type="submit">Sign Up</Button>
      </form>

      <Message>
        Already a breaditor ?
        <ChangeTab type="button" onClick={() => changeTab("signIn")}>
          Log In
        </ChangeTab>
      </Message>
    </>
  );
}

SignUp.propTypes = {
  changeTab: PropTypes.func,
};

SignUp.defaultProps = {
  changeTab: () => {},
};

export default SignUp;
