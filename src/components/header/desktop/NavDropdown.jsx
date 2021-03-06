import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSubscription } from "../../../contexts/SubscriptionContext";
import useDropdown from "../../../hooks/useDropdown";
import useSubreadit from "../../../hooks/useSubreadit";

// Icons
import { ReactComponent as IconCommunity } from "../../../assets/icons/header/icon-community.svg";
import { ReactComponent as IconFeed } from "../../../assets/icons/header/icon-feed.svg";
import { ReactComponent as IconHome } from "../../../assets/icons/header/icon-home.svg";
import { ReactComponent as IconSettings } from "../../../assets/icons/header/icon-settings.svg";
import { ReactComponent as IconPost } from "../../../assets/icons/header/icon-post.svg";

function NavDropdown() {
  const [mySubreadits, setMySubreadits] = useState([]);
  const [topSubreadits, setTopSubreadits] = useState([]);
  const dropdownRef = useRef();
  const { getSubreaditById, getPopularSubreadits } = useSubreadit();
  const { subscriptions } = useSubscription();
  const {
    isDropdownOpen,
    setIsDropdownOpen,
    current,
    handleChoice,
  } = useDropdown(dropdownRef);

  // Gets top subreadits
  useEffect(() => {
    (async () => {
      const popular = await getPopularSubreadits(5);
      setTopSubreadits(popular);
    })();
  }, []);

  // Gets the subreadits the user joined
  useEffect(() => {
    (async () => {
      let subreadits = [];
      await Promise.all(
        subscriptions.map(async (subscription) => {
          const subreadit = await getSubreaditById(subscription);
          subreadits.push({
            id: subreadit.data().id,
            name: subreadit.data().name,
            icon: subreadit.data().icon,
          });
        })
      );
      subreadits = subreadits.sort((a, b) => b.name - a.name);
      setMySubreadits(subreadits);
    })();
  }, [subscriptions]);

  return (
    <Dropdown ref={dropdownRef}>
      <DropdownHeader
        isDropdownOpen={isDropdownOpen}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {current || "Navigation"}
      </DropdownHeader>
      {isDropdownOpen && (
        <DropdownList>
          <Category>Breadit Feeds</Category>
          <Choice to="/" onClick={() => handleChoice("Home")}>
            <IconHome />
            <div>Home</div>
          </Choice>
          <Choice to="/b/all" onClick={() => handleChoice("All")}>
            <IconFeed />
            <div>All</div>
          </Choice>

          {mySubreadits.length !== 0 && (
            <>
              <Category>My Communities</Category>
              {mySubreadits.map((subreadit) => {
                return (
                  <Choice
                    key={subreadit.id}
                    to={`/b/${subreadit.name}`}
                    onClick={() => handleChoice(`b/${subreadit.name}`)}
                  >
                    <Icon
                      src={subreadit.icon}
                      alt={`${subreadit.name}'s Icon`}
                    />
                    <div>
                      b/
                      {subreadit.name}
                    </div>
                  </Choice>
                );
              })}
            </>
          )}

          <Category>Discover</Category>
          {topSubreadits.map((subreadit) => {
            return (
              <Choice
                key={subreadit.id}
                to={`/b/${subreadit.name}`}
                onClick={() => handleChoice(`b/${subreadit.name}`)}
              >
                <Icon src={subreadit.icon} alt={`${subreadit.name}'s Icon`} />
                <div>
                  b/
                  {subreadit.name}
                </div>
              </Choice>
            );
          })}

          <Category>Others</Category>
          <Choice to="/settings" onClick={() => handleChoice("User Settings")}>
            <IconSettings />
            <div>User Settings</div>
          </Choice>
          <Choice to="/submit" onClick={() => handleChoice("Create Post")}>
            <IconPost />
            <div>Create Post</div>
          </Choice>
          <Choice
            to="/create/subreadit"
            onClick={() => handleChoice("Create Community")}
          >
            <IconCommunity />
            <div>Create Community</div>
          </Choice>
        </DropdownList>
      )}
    </Dropdown>
  );
}

export default NavDropdown;

const Dropdown = styled.div`
  position: relative;
`;

const DropdownHeader = styled.button`
  padding: 0.5rem 1.75rem;
  border: 1px solid ${(props) => props.theme.border};
  cursor: pointer;
  width: 15rem;
`;

const DropdownList = styled.div`
  position: absolute;
  background: ${(props) => props.theme.backgroundSecondary};
  padding-bottom: 1rem;
  max-height: 30rem;
  overflow: auto;
  width: 15rem;

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar {
    width: 10px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #000000;
    border: 2px solid #555555;
  }
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

  &:hover {
    background: ${(props) => props.theme.border};
  }
`;

const Icon = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`;
