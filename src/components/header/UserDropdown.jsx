import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useDropdown from "../../hooks/useDropdown";
import useUser from "../../hooks/useUser";
import Entry from "../entry/Entry";

// Icons
import { ReactComponent as IconUser } from "../../assets/icons/header/icon-user.svg";
import { ReactComponent as IconSettings } from "../../assets/icons/header/icon-settings.svg";
import { ReactComponent as IconLight } from "../../assets/icons/header/icon-light.svg";
import { ReactComponent as IconLogOut } from "../../assets/icons/header/icon-logout.svg";
import { ReactComponent as IconLogIn } from "../../assets/icons/header/icon-login.svg";

function UserDropdown() {
  const { currentUser, signOut } = useAuth();
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen } = useDropdown(dropdownRef);
  const { getUser, getKarma } = useUser();
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      if (!currentUser) {
        setUser(null);
      } else {
        const data = await getUser(currentUser.uid);
        const karma = await getKarma(currentUser.uid);
        setUser({ ...data, karma });
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
                <div>{user.karma} karma</div>
              </Informations>
            </User>
          ) : (
            <IconUser />
          ) }
        </DropdownHeader>
        {isDropdownOpen && (
          <DropdownList>
            {currentUser && (
              <>
                <Category>My stuff</Category>
                <Choice to={`/u/${currentUser.uid}`}>
                  <IconUser />
                  <div>Profile</div>
                </Choice>
                <Choice to="/settings">
                  <IconSettings />
                  <div>User Settings</div>
                </Choice>
              </>
            )}

            <Category>View Options</Category>
            <Choice as="button" type="button">
              <IconLight />
              <div>Night Mode</div>
            </Choice>

            {currentUser ? (
              <Choice as="button" type="button" onClick={signOut}>
                <IconLogOut />
                <div>Log Out</div>
              </Choice>
            ) : (
              <Choice
                as="button"
                type="button"
                onClick={() => setIsEntryModalOpen(true)}
              >
                <IconLogIn />
                <div>Log In / Sign Up</div>
              </Choice>
            )}
          </DropdownList>
        )}
      </Dropdown>

      <EntryModal
        isOpen={isEntryModalOpen}
        onRequestClose={() => setIsEntryModalOpen(false)}
      >
        <Entry close={() => setIsEntryModalOpen(false)} />
      </EntryModal>
    </>
  );
}

export default UserDropdown;

const colors = {
  background: "white",
  hover: "lightgrey",
};

const Dropdown = styled.div`
  position: relative;
`;

const DropdownHeader = styled.button`
  border: 1px solid ${colors.hover};
  cursor: pointer;
  width: 15rem;
`;

const DropdownList = styled.div`
  position: absolute;
  background: ${colors.background};
  border: 1px solid ${colors.hover};
  padding-bottom: 1rem;
  max-height: 30rem;
  overflow: auto;
  width: 15rem;
`;

const Category = styled.div`
  text-transform: uppercase;
  font-weight: 500;
  font-size: 0.75rem;
  margin: 1rem;
`;

const Choice = styled(Link)`
  display: grid;
  grid-template-columns: 2rem 1fr;
  grid-gap: 0.75rem;
  align-items: center;
  padding: 0.35rem 1.75rem;
  justify-items: start;
  width: 100%;

  &:hover {
    background: ${colors.hover};
  }
`;

const User = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr;
  grid-gap: 1rem;
  justify-items: start;
  text-align: start;
`;

const Informations = styled.div`
  font-size: .75rem;
`;

const Name = styled.div`
  font-weight: 500;
`;

const Icon = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 3px;
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