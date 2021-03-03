import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useSubreadit from "../../../hooks/useSubreadit";
import useDropdown from "../../../hooks/useDropdown";

// Icons
import { ReactComponent as IconTop } from "../../../assets/icons/sort/icon-top.svg";
import { ReactComponent as IconUp } from "../../../assets/icons/general/icon-up.svg";
import { ReactComponent as IconDown } from "../../../assets/icons/general/icon-down.svg";

function Top({ closeHeader }) {
  const [subreadits, setSubreadits] = useState([]);
  const { getPopularSubreadits } = useSubreadit();
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen } = useDropdown(dropdownRef, false);

  useEffect(() => {
    (async () => {
      const subreadits = await getPopularSubreadits();
      setSubreadits(subreadits);
    })();
  }, []);

  return (
    <>
      {subreadits.length !== 0 && (
        <div ref={dropdownRef}>
          <DropdownHeader
            isDropdownOpen={isDropdownOpen}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <IconTop />
            Top Subreadits
            {isDropdownOpen ? <IconUp /> : <IconDown />}
          </DropdownHeader>

          {isDropdownOpen && (
            <DropdownList>
              {subreadits.map((subreadit) => {
                return (
                  <Choice
                    to={`/b/${subreadit.name}`}
                    onClick={closeHeader}
                    key={subreadit.id}
                  >
                    <Icon
                      src={subreadit.icon}
                      alt={`${subreadit.name}'s Icon`}
                    />
                    b/
                    {subreadit.name}
                  </Choice>
                );
              })}
            </DropdownList>
          )}
        </div>
      )}
    </>
  );
}

export default Top;

Top.propTypes = {
  closeHeader: PropTypes.func,
};

Top.defaultProps = {
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

const Icon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
`;

const Choice = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.25rem 0 0.25rem 3rem;

  & > img {
    margin-right: 1rem;
  }

  &:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }
`;