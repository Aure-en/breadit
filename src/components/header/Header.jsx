import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Entry from "../entry/Entry";
import SubreaditDropdown from "./SubreaditDropdown";
import UserDropdown from "./UserDropdown";

// Icons
import { ReactComponent as IconHome } from "../../assets/icons/header/icon-home.svg";
import { ReactComponent as IconFeed } from "../../assets/icons/header/icon-feed.svg";
import { ReactComponent as IconPost } from "../../assets/icons/header/icon-post.svg";

function Header() {
  const { currentUser } = useAuth();
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  return (
    <Container>
      <div>{/* TO-DO : Add Breadit Icon */}</div>

      {currentUser && <SubreaditDropdown />}

      <Buttons>
        {currentUser ? (
          <>
            <LinkIcon to="/" data-tip="My Feed">
              <IconHome />
            </LinkIcon>
            <LinkIcon to="/b/all" data-tip="All">
              <IconFeed />
            </LinkIcon>
            <LinkIcon to="/submit" data-tip="Create Post">
              <IconPost />
            </LinkIcon>
            <ReactTooltip effect="solid" delayShow={300} />
          </>
        ) : (
          <>
            <Button type="button" onClick={() => setIsLogInModalOpen(true)}>
              Log In
            </Button>
            <ButtonFilled
              type="button"
              onClick={() => setIsSignUpModalOpen(true)}
            >
              Sign Up
            </ButtonFilled>
          </>
        )}
      </Buttons>

      <UserDropdown />

      <EntryModal
        isOpen={isLogInModalOpen}
        onRequestClose={() => setIsLogInModalOpen(false)}
      >
        <Entry close={() => setIsLogInModalOpen(false)} entryTab="signIn" />
      </EntryModal>

      <EntryModal
        isOpen={isSignUpModalOpen}
        onRequestClose={() => setIsSignUpModalOpen(false)}
      >
        <Entry close={() => setIsSignUpModalOpen(false)} entryTab="signUp" />
      </EntryModal>
    </Container>
  );
}

export default Header;

const Container = styled.header`
  display: flex;
  z-index: 1;
`;

const EntryModal = styled(Modal)`
  width: 30rem;
  height: 30rem;
  border: 1px solid red;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Buttons = styled.div``;

const Button = styled.button`
  width: 8rem;
`;

const ButtonFilled = styled(Button)``;

const LinkIcon = styled(Link)``;
