import React from "react";
import styled from "styled-components";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import { useEntry } from "../../contexts/EntryContext";

// Assets
import { ENTRY_IMG } from "../../utils/const";
import { ReactComponent as IconClose } from "../../assets/icons/general/icon-x.svg";

function Entry() {
  const { isEntryModalOpen, closeEntry, currentTab } = useEntry();

  return (
    <>
      {isEntryModalOpen && (
        <Overlay onClick={closeEntry}>
          <Container onClick={(e) => e.stopPropagation()}>
            <Content>
              {currentTab === "signIn" && <SignIn />}
              {currentTab === "signUp" && <SignUp />}
              {currentTab === "forgotPassword" && <ForgotPassword />}
            </Content>
            <Close type="button" onClick={closeEntry}>
              <IconClose />
            </Close>
          </Container>
        </Overlay>
      )}
    </>
  );
}

export default Entry;

const Overlay = styled.div`
  position: fixed;
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  padding: 2rem;
  border-radius: 0.5rem;

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
