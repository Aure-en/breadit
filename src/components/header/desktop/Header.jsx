import React from "react";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useEntry } from "../../../contexts/EntryContext";
import NavDropdown from "./NavDropdown";
import UserDropdown from "./UserDropdown";
import LinkInbox from "./LinkInbox";

// Icons
import { ReactComponent as IconHome } from "../../../assets/icons/header/icon-home.svg";
import { ReactComponent as IconFeed } from "../../../assets/icons/header/icon-feed.svg";
import { ReactComponent as IconPost } from "../../../assets/icons/header/icon-post.svg";

function Header() {
  const { currentUser } = useAuth();
  const { openSignIn, openSignUp } = useEntry();

  return (
    <Container>
      <div>{/* TO-DO : Add Breadit Icon */}</div>

      {currentUser && <NavDropdown />}

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
            <LinkInbox />
            <ReactTooltip effect="solid" delayShow={300} />
          </>
        ) : (
          <>
            <Button type="button" onClick={openSignIn}>
              Log In
            </Button>
            <ButtonFilled type="button" onClick={openSignUp}>
              Sign Up
            </ButtonFilled>
          </>
        )}
      </Buttons>

      <UserDropdown />
    </Container>
  );
}

export default Header;

const Container = styled.header`
  display: flex;
  z-index: 10;
  background: ${(props) => props.theme.backgroundQuaternary};
`;

const Buttons = styled.div``;

const Button = styled.button`
  width: 8rem;
`;

const ButtonFilled = styled(Button)``;

const LinkIcon = styled(Link)``;
