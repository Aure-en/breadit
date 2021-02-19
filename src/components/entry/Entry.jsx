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
    <>
      {currentTab === "signIn" && <SignIn changeTab={setCurrentTab} />}
      {currentTab === "signUp" && <SignUp changeTab={setCurrentTab} />}
      {currentTab === "forgotPassword" && (
        <ForgotPassword changeTab={setCurrentTab} />
      )}
      <Close type="button" onClick={close}>
        <IconClose />
      </Close>
    </>
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

const Close = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;
