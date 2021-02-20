import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useDropdown from "../../hooks/useDropdown";

// Icons
import { ReactComponent as IconDown } from "../../assets/icons/general/icon-caret-down.svg";

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
        <div>Sort by: {sort}</div>
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
            New
          </Option>
          <Option
            type="button"
            onClick={() => {
              handleChoice("top");
              setSort("top");
            }}
          >
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

const Dropdown = styled.div``;

const DropdownHeader = styled.div``;

const DropdownList = styled.div``;

const Option = styled.button``;
