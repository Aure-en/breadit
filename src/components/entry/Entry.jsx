import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import { ReactComponent as IconClose } from "../../assets/icons/general/icon-x.svg";

// Image
import { ENTRY_IMG } from "../../utils/const";

function Entry({ close, entryTab }) {
  const [currentTab, setCurrentTab] = useState(entryTab);

  return (
    <Overlay onClick={close}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Content>
          {currentTab === "signIn" && <SignIn changeTab={setCurrentTab} />}
          {currentTab === "signUp" && <SignUp changeTab={setCurrentTab} />}
          {currentTab === "forgotPassword" && (
            <ForgotPassword changeTab={setCurrentTab} />
          )}
        </Content>
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${(props) => props.theme.overlay};
  z-index: 99;
`;

const Container = styled.div`
  position: absolute;
  background: ${(props) => props.theme.backgroundSecondary};
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;

  @media all and (min-width: 576px) {
    width: 30rem;
    height: 30rem;
    box-shadow: 0 0 15px ${(props) => props.theme.shadow};
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(
        to right,
        transparent 30%,
        ${(props) => props.theme.backgroundSecondary} 30%
      ),
      url(${ENTRY_IMG});
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: .5rem;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;

  & > * {
    flex: 1;
  }

  @media all and (min-width: 576px) {
    margin-left: 12rem;
    max-width: 15rem;
  }
`;

const Close = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;
