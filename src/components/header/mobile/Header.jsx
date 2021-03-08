import React, { useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useEntry } from "../../../contexts/EntryContext";
import useDropdown from "../../../hooks/useDropdown";
import Top from "./Top";
import Subscriptions from "./Subscriptions";
import Settings from "./Settings";

// Icons
import { ReactComponent as IconHamburger } from "../../../assets/icons/header/icon-hamburger.svg";
import { ReactComponent as IconUser } from "../../../assets/icons/header/icon-user.svg";
import { ReactComponent as IconFeed } from "../../../assets/icons/header/icon-feed.svg";
import { ReactComponent as IconInbox } from "../../../assets/icons/header/icon-inbox.svg";
import { ReactComponent as IconSaved } from "../../../assets/icons/header/icon-saved.svg";
import { BREADIT_ICON } from "../../../utils/const";

function Header() {
  const { currentUser } = useAuth();
  const { openSignUp } = useEntry();
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen, closeDropdown } = useDropdown(
    dropdownRef
  );

  return (
    <Container>
      <Logo src={BREADIT_ICON} alt="Breadit Icon" />
      <Brand>Breadit</Brand>
      <Dropdown ref={dropdownRef}>
        <DropdownHeader
          isDropdownOpen={isDropdownOpen}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <IconHamburger />
        </DropdownHeader>

        {isDropdownOpen && (
          <DropdownList>
            {currentUser && (
              <>
                <Choice
                  to={`/u/${currentUser.displayName.toLowerCase()}`}
                  onClick={closeDropdown}
                >
                  <IconUser />

                  {currentUser.displayName}
                </Choice>

                <Choice to="/inbox" onClick={closeDropdown}>
                  <IconInbox />
                  Inbox
                </Choice>
              </>
            )}

            <Top closeHeader={closeDropdown} />

            <Subscriptions closeHeader={closeDropdown} />

            {currentUser && (
              <Choice
                to={`/u/${currentUser.displayName.toLowerCase()}/saved`}
                onClick={closeDropdown}
              >
                <IconSaved />
                Saved
              </Choice>
            )}

            <Settings closeHeader={closeDropdown} />

            <Choice to="/b/all" onClick={closeDropdown}>
              <IconFeed />
              Popular
            </Choice>
            {!currentUser && (
              <Button type="button" onClick={openSignUp}>
                Sign up / Log in
              </Button>
            )}
          </DropdownList>
        )}
      </Dropdown>
    </Container>
  );
}

export default Header;

const Container = styled.header`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  background: ${(props) => props.theme.backgroundQuaternary};
  z-index: 15;
`;

const Logo = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`;

const Brand = styled.div``;

const Dropdown = styled.div``;

const DropdownHeader = styled.button`
  padding: 0.5rem 1rem;
`;

const DropdownList = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  right: 0;
  padding: 0.5rem 0;
  background: ${(props) => props.theme.backgroundSecondary};
  box-shadow: 0 -3px 10px ${(props) => props.theme.backgroundQuaternary};
`;

const Choice = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.35rem 1.75rem;

  & > svg {
    margin-right: 1rem;
  }

  &:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }
`;

const Button = styled.button`
  display: block;
  color: ${(props) => props.theme.backgroundSecondary};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  margin: 0.75rem 0;
  font-weight: 500;
  align-self: center;
  text-align: center;
`;
