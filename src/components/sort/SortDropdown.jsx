import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useDropdown from "../../hooks/useDropdown";

// Icons
import { ReactComponent as IconDown } from "../../assets/icons/general/icon-down.svg";
import { ReactComponent as IconTop } from "../../assets/icons/sort/icon-top.svg";
import { ReactComponent as IconNew } from "../../assets/icons/sort/icon-new.svg";

function SortDropdown({ setSort, sort }) {
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen, handleChoice } = useDropdown(
    dropdownRef
  );

  return (
    <Dropdown ref={dropdownRef}>
      <DropdownHeader
        isDropdownOpen={isDropdownOpen}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Sort by:
        {"\u00A0"}
        <CurrentChoice>{sort}</CurrentChoice>
        <IconDown />
      </DropdownHeader>
      {isDropdownOpen && (
        <DropdownList>
          <Option
            type="button"
            onClick={() => {
              handleChoice("new");
              setSort("new");
            }}
          >
            <IconNew />
            New
          </Option>
          <Option
            type="button"
            onClick={() => {
              handleChoice("top");
              setSort("top");
            }}
          >
            <IconTop />
            Top
          </Option>
        </DropdownList>
      )}
    </Dropdown>
  );
}

export default SortDropdown;

SortDropdown.propTypes = {
  setSort: PropTypes.func.isRequired,
  sort: PropTypes.string,
};

SortDropdown.defaultProps = {
  sort: "new",
};

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 1rem;
  z-index: 5;
  color: ${(props) => props.theme.secondary};
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
  background: ${(props) => props.theme.backgroundSecondary};
  border: 1px solid ${(props) => props.theme.secondary};
  max-height: 30rem;
  z-index: 5;
  font-size: .75rem;
`;

const Option = styled.button`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0.75rem;
  align-items: center;
  padding: 0.35rem 1rem;
  justify-items: start;
  font-weight: 500;
  color: ${(props) => props.theme.secondary};

  &:hover {
    background: ${(props) => props.theme.accentSoft};
  }
`;
