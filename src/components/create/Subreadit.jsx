import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useSubreadit from "../../hooks/useSubreadit";
import useDropdown from "../../hooks/useDropdown";

// Icons
import { ReactComponent as IconDown } from "../../assets/icons/general/icon-down.svg";

function Subreadit({ initial, select }) {
  const [subreadits, setSubreadits] = useState([]);
  const { getSubreadits } = useSubreadit();
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen } = useDropdown(dropdownRef);

  // Get list of subreadits
  useEffect(() => {
    (async () => {
      const subreaditsList = await getSubreadits();
      setSubreadits(subreaditsList);
    })();
  }, []);

  return (
    <Dropdown ref={dropdownRef}>
      <DropdownHeader
        isDropdownOpen={isDropdownOpen}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {initial.name || "Choose a community"}
        <IconDown />
      </DropdownHeader>
      {isDropdownOpen && (
        <DropdownList>
          {subreadits.map((subreadit) => {
            return (
              <li key={subreadit.id}>
                <DropdownChoice
                  onClick={() => {
                    select(subreadit);
                    setIsDropdownOpen(false);
                  }}
                >
                  <SubreaditIcon src={subreadit.icon} alt={subreadit.name} />
                  <div>
                    <div>
                      b/
                      {subreadit.name}
                    </div>
                    <Small>
                      {subreadit.members} member
                      {subreadit.members !== 1 && "s"}
                    </Small>
                  </div>
                </DropdownChoice>
              </li>
            );
          })}
        </DropdownList>
      )}
    </Dropdown>
  );
}

Subreadit.propTypes = {
  select: PropTypes.func.isRequired,
  initial: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

Subreadit.defaultProps = {
  initial: PropTypes.shape({
    id: "",
    name: "",
  }),
};

export default Subreadit;

const Dropdown = styled.div`
  position: relative;
  max-width: 20rem;
  border: 1px solid ${(props) => props.theme.border_secondary};
  z-index: 5;
  box-shadow: 0 0 10px -5px ${(props) => props.theme.vote_neutral};
`;

const DropdownHeader = styled.button`
  display: grid;
  grid-template-columns: 1fr auto;
  background: ${(props) => props.theme.input_bg};
  color: ${(props) => props.theme.text_primary};
  padding: 0.75rem;
  border-radius: ${(props) => (props.isDropdownOpen ? "5px 5px 0 0" : "5px")};
  cursor: pointer;
  width: 100%;
  justify-items: start;
`;

const DropdownList = styled.ul`
  position: absolute;
  left: 0;
  right: 0;
  background: ${(props) => props.theme.input_bg};
  max-height: 25rem;
  overflow-y: auto;
  padding: 0.75rem 0;
  margin: 0;
  border: 1px solid transparent;
  outline: 1px solid ${(props) => props.theme.border_secondary};

  & > li {
    margin: 0 0.5rem 1rem 0.5rem;
  }

  & > li:last-child {
    margin: 0 0.5rem 0 0.5rem;
  }
`;

const DropdownChoice = styled.button`
  display: flex;
  color: ${(props) => props.theme.text_primary};
  align-items: center;
  width: 100%;
  padding: 0;

  & > * {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SubreaditIcon = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const Small = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.text_secondary};
`;
