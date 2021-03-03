import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import useDropdown from "../../../hooks/useDropdown";

// Icons
import { ReactComponent as IconDown } from "../../../assets/icons/general/icon-down.svg";
import { ReactComponent as IconUp } from "../../../assets/icons/general/icon-up.svg";
import { ReactComponent as IconSettings } from "../../../assets/icons/header/icon-settings.svg";

function Settings({ closeHeader }) {
  const { currentUser } = useAuth();
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen } = useDropdown(dropdownRef);

  return (
    <div ref={dropdownRef}>
      <DropdownHeader
        isDropdownOpen={isDropdownOpen}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <IconSettings />
        Settings
        {isDropdownOpen ? <IconUp /> : <IconDown />}
      </DropdownHeader>

      {isDropdownOpen && (
        <DropdownList>
          <Choice as="button" type="button">
            Night Mode
          </Choice>
          {currentUser && (
            <Choice to="/settings" onClick={closeHeader}>
              Account Settings
            </Choice>
          )}
        </DropdownList>
      )}
    </div>
  );
}

export default Settings;

Settings.propTypes = {
  closeHeader: PropTypes.func,
};

Settings.defaultProps = {
  closeHeader: () => {},
};

const DropdownHeader = styled.button`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  justify-items: start;
  padding: 0.35rem 1.75rem;
  width: 100%;

  & > *:first-child {
    margin-right: 1rem;
  }
`;

const DropdownList = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
`;

const Choice = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.25rem 0 0.25rem 4.25rem;

  & > img {
    margin-right: 1rem;
  }

  &:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }
`;
