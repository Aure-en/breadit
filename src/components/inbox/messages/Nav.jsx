import React, { useRef } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import useDropdown from "../../../hooks/useDropdown";

import { ReactComponent as IconDown } from "../../../assets/icons/general/icon-down.svg";

function Nav() {
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen, closeDropdown } = useDropdown(
    dropdownRef
  );
  const location = useLocation();

  return (
    <Dropdown ref={dropdownRef}>
      <DropdownHeader
        isDropdownOpen={isDropdownOpen}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Messages:
        {"\u00A0"}
        <CurrentChoice>
          {location.pathname === "/inbox/messages" && "Received"}
          {location.pathname === "/inbox/messages/sent" && "Sent"}
        </CurrentChoice>
        <IconDown />
      </DropdownHeader>

      {isDropdownOpen && (
        <DropdownList>
          <Option to="/inbox/messages" onClick={closeDropdown}>
            Received
          </Option>
          <Option to="/inbox/messages/sent" onClick={closeDropdown}>
            Sent
          </Option>
        </DropdownList>
      )}
    </Dropdown>
  );
}

export default Nav;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
  z-index: 5;
  color: ${(props) => props.theme.text_secondary};
  padding: 0.5rem 0;
`;

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
`;

const CurrentChoice = styled.div`
  color: ${(props) => props.theme.accent};
`;

const DropdownList = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.bg_container};
  border: 1px solid ${(props) => props.theme.text_secondary};
  max-height: 30rem;
  z-index: 5;
  font-size: 0.75rem;
`;

const Option = styled(Link)`
  padding: 0.35rem 1rem;
  font-weight: 500;
  color: ${(props) => props.theme.text_secondary};

  &:hover {
    background: ${(props) => props.theme.accent_soft};
  }
`;
