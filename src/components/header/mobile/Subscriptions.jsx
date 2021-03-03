import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useSubscription } from "../../../contexts/SubscriptionContext";
import useSubreadit from "../../../hooks/useSubreadit";
import useDropdown from "../../../hooks/useDropdown";

// Icons
import { ReactComponent as IconDown } from "../../../assets/icons/general/icon-down.svg";
import { ReactComponent as IconUp } from "../../../assets/icons/general/icon-up.svg";
import { ReactComponent as IconCommunity } from "../../../assets/icons/header/icon-community.svg";

function Subscriptions({ closeHeader }) {
  const [subreadits, setSubreadits] = useState([]);
  const { getSubreaditById } = useSubreadit();
  const { subscriptions } = useSubscription();
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen } = useDropdown(dropdownRef, false);

  useEffect(() => {
    (async () => {
      const subreadits = await Promise.all(
        subscriptions.map(async (subscription) => {
          const subreadit = await getSubreaditById(subscription);
          return subreadit.data();
        })
      );
      setSubreadits(subreadits);
    })();
  }, [subscriptions]);

  return (
    <>
      {subreadits.length !== 0 && (
        <div ref={dropdownRef}>
          <DropdownHeader
            isDropdownOpen={isDropdownOpen}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <IconCommunity />
            My Subreadits
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

export default Subscriptions;

Subscriptions.propTypes = {
  closeHeader: PropTypes.func,
};

Subscriptions.defaultProps = {
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
