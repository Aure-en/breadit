import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useForgotPassword from "../../hooks/useForgotPassword";

const Field = styled.div``;

const Label = styled.label`
  position: absolute;
  top: -9999px;
`;

const Input = styled.input``;

const Message = styled.div``;

const Button = styled.button``;

const ChangeTab = styled.button``;

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
          <Message>{emailError}</Message>
        </Field>

        <Button type="submit">Reset Password</Button>
        <Message>{message}</Message>
      </form>

      <div>
        <ChangeTab type="button" onClick={() => changeTab("signIn")}>
          Log In
        </ChangeTab>
        <ChangeTab type="button" onClick={() => changeTab("signUp")}>
          Sign Up
        </ChangeTab>
      </div>
    </>
  );
}

ForgotPassword.propTypes = {
  changeTab: PropTypes.func,
};

ForgotPassword.defaultProps = {
  changeTab: () => {},
};

export default ForgotPassword;
