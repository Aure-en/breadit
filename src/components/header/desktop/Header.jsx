import React from "react";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useEntry } from "../../../contexts/EntryContext";
import NavDropdown from "./NavDropdown";
import UserDropdown from "./UserDropdown";
import LinkInbox from "./LinkInbox";

// Assets
import { ReactComponent as IconHome } from "../../../assets/icons/header/icon-home.svg";
import { ReactComponent as IconFeed } from "../../../assets/icons/header/icon-feed.svg";
import { ReactComponent as IconPost } from "../../../assets/icons/header/icon-post.svg";
import { BREADIT_ICON, BREADIT_BRAND } from "../../../utils/const";

function Header() {
  const { currentUser } = useAuth();
  const { openSignIn, openSignUp } = useEntry();

  return (
    <Container>
      <Column>
        <Link to="/">
          <Breadit>
            <Logo src={BREADIT_ICON} alt="Breadit Icon" />
            <Brand src={BREADIT_BRAND} alt="Breadit Brand" />
          </Breadit>
        </Link>

        {currentUser && <NavDropdown />}
      </Column>

      <Column>
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
      </Column>
    </Container>
  );
}

export default Header;

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 15;
  background: ${(props) => props.theme.header_bg};
  padding: 0.25rem 1rem;
`;

const Column = styled.div`
  display: flex;
`;

const Breadit = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;

  & > *:first-child {
    margin-right: 1rem;
  }
`;

const Logo = styled.img`
  width: 2rem;
  height: 2rem;
`;

const Brand = styled.img`
  height: 1.25rem;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;

  & > button:first-child {
    margin-right: 1rem;
  }
`;

const Button = styled.button`
  border: 1px solid ${(props) => props.theme.header_text};
  color: ${(props) => props.theme.header_text};
  border-radius: 5rem;
  padding: 0.35rem 1.25rem;
  font-weight: 500;
  text-align: center;

  &:hover {
    color: ${(props) => props.theme.header_text_active};
    border: 1px solid ${(props) => props.theme.header_text_active};
  }
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.header_bg};
  background-color: ${(props) => props.theme.bg_app};
  border: 1px solid ${(props) => props.theme.bg_app};
  opacity: 0.95;

  &:hover {
    color: ${(props) => props.theme.header_bg};
    background-color: ${(props) => props.theme.header_text_active};
    border: 1px solid ${(props) => props.theme.header_text_active};
    opacity: 1;
  }
`;

const LinkIcon = styled(Link)`
  padding: 0.15rem 0.25rem;
  color: ${(props) => props.theme.header_text};

  &:hover {
    color: ${(props) => props.theme.header_text_active};
  }
`;
