import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import { ReactComponent as IconClose } from "../../assets/icons/icon-x.svg";

const colors = {
  overlay: "rgba(0, 0, 0, .2)",
  background: "rgb(255, 255, 255)",
};

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: ${colors.overlay};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border: 1px solid red;
  background: ${colors.background};
`;

const Close = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

function Entry({ close, entryTab = "signUp" }) {
  const [currentTab, setCurrentTab] = useState(entryTab);

  return (
    <Overlay>
      <Box>
        {currentTab === "signIn" && <SignIn changeTab={setCurrentTab} />}
        {currentTab === "signUp" && <SignUp changeTab={setCurrentTab} />}
        {currentTab === "forgotPassword" && (
          <ForgotPassword changeTab={setCurrentTab} />
        )}
        <Close type="button" onClick={close}>
          <IconClose />
        </Close>
      </Box>
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
