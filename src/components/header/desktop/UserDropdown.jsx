import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useEntry } from "../../../contexts/EntryContext";
import useDropdown from "../../../hooks/useDropdown";
import useUser from "../../../hooks/useUser";
import ThemeSwitch from "./ThemeSwitch";

// Icons
import { ReactComponent as IconUser } from "../../../assets/icons/header/icon-user.svg";
import { ReactComponent as IconSettings } from "../../../assets/icons/header/icon-settings.svg";
import { ReactComponent as IconLight } from "../../../assets/icons/header/icon-light.svg";
import { ReactComponent as IconLogOut } from "../../../assets/icons/header/icon-logout.svg";
import { ReactComponent as IconLogIn } from "../../../assets/icons/header/icon-login.svg";
import { ReactComponent as IconDown } from "../../../assets/icons/general/icon-down.svg";

function UserDropdown() {
  const { currentUser, signOut } = useAuth();
  const { openSignUp } = useEntry();
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen } = useDropdown(dropdownRef);
  const { getUser, getKarma } = useUser();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      if (!currentUser) {
        setUser(null);
      } else {
        const data = await getUser(currentUser.uid);
        const karma = await getKarma(currentUser.uid);
        setUser({ ...data.data(), karma });
      }
    })();
  }, [currentUser]);

  return (
    <>
      <Dropdown ref={dropdownRef}>
        <DropdownHeader
          isDropdownOpen={isDropdownOpen}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {user ? (
            <User>
              <Icon src={user.avatar} alt={`${user.name}'s avatar`} />
              <Informations>
                <Name>{user.username}</Name>
                <div>
{user.karma}
                  {' '}
                  karma
</div>
              </Informations>
            </User>
          ) : (
            <IconUser />
          )}
          <IconDown />
        </DropdownHeader>
        {isDropdownOpen && (
          <DropdownList>
            {currentUser && (
              <>
                <Category>My stuff</Category>
                <Choice
                  to={`/u/${currentUser.displayName}`}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <IconUser />
                  <div>Profile</div>
                </Choice>
                <Choice to="/settings" onClick={() => setIsDropdownOpen(false)}>
                  <IconSettings />
                  <div>User Settings</div>
                </Choice>
              </>
            )}

            <Category>View Options</Category>
            <ThemeSwitch onClick={() => setIsDropdownOpen(false)} />

            {currentUser ? (
              <Choice
                as="button"
                type="button"
                onClick={() => {
                  signOut();
                  setIsDropdownOpen(false);
                }}
              >
                <IconLogOut />
                <div>Log Out</div>
              </Choice>
            ) : (
              <Choice
                as="button"
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  openSignUp();
                }}
              >
                <IconLogIn />
                <div>Log In / Sign Up</div>
              </Choice>
            )}
          </DropdownList>
        )}
      </Dropdown>
    </>
  );
}

export default UserDropdown;

const Dropdown = styled.div`
  position: relative;
`;

const DropdownHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(props) => props.theme.header_text};
  border: 1px solid
    ${(props) =>
      props.isDropdownOpen ? props.theme.header_text : "transparent"};
  border-bottom: ${(props) => props.isDropdownOpen && "1px solid transparent"};
  border-radius: 3px 0 3px 3px;
  padding: 0.1rem 0.5rem;
  cursor: pointer;

  &:hover {
    border: 1px solid ${(props) => props.theme.header_text};
    border-bottom: ${(props) =>
      props.isDropdownOpen && "1px solid transparent"};
  }

  & > svg:last-child {
    margin-left: 1rem;
  }
`;

const DropdownList = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.bg_container};
  border: 1px solid ${(props) => props.theme.header_text};
  padding-bottom: 1rem;
  max-height: 30rem;
  overflow: auto;
  width: 12.5rem;
  border-radius: 3px 0 3px 3px;
`;

const Category = styled.div`
  text-transform: uppercase;
  font-weight: 500;
  font-size: 0.65rem;
  margin: 0.5rem 1rem;
  color: ${(props) => props.theme.text_secondary};
`;

const Choice = styled(Link)`
  display: grid;
  grid-template-columns: 2rem 1fr;
  grid-gap: 0.75rem;
  align-items: center;
  padding: 0.25rem 1rem;
  justify-items: start;
  color: ${(props) => props.theme.text_primary};

  & > svg:first-child {
    color: ${(props) => props.theme.text_secondary};
  }

  &:hover {
    background: ${(props) => props.theme.header_bg_secondary};
  }
`;

const User = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr;
  grid-gap: 1rem;
  justify-items: start;
  align-items: center;
  text-align: start;
`;

const Informations = styled.div`
  font-size: 0.75rem;
`;

const Name = styled.div`
  font-weight: 500;
`;

const Icon = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 3px;
  background: ${(props) => props.theme.header_bg};
`;
