import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import { ReactComponent as IconClose } from "../../assets/icons/general/icon-x.svg";

function Entry({ close, entryTab }) {
  const [currentTab, setCurrentTab] = useState(entryTab);

  return (
    <Overlay>
      <Container>
        {currentTab === "signIn" && <SignIn changeTab={setCurrentTab} />}
        {currentTab === "signUp" && <SignUp changeTab={setCurrentTab} />}
        {currentTab === "forgotPassword" && (
          <ForgotPassword changeTab={setCurrentTab} />
        )}
        <Close type="button" onClick={close}>
          <IconClose />
        </Close>
      </Container>
    </Overlay>
  );
}

Entry.propTypes = {
  close: PropTypes.func,
  entryTab: PropTypes.string,
};

Entry.defaultProps = {
  close: () => {},
  entryTab: "signUp",
};

export default Entry;

const Overlay = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  max-height: 100%;
  z-index: 12;
`;

const Container = styled.div`
  width: 30rem;
  height: 30rem;
  border: 1px solid red;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 11;
`;

const Close = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;
