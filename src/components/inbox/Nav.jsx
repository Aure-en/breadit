import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useMessage from "../../hooks/useMessage";
import useNotification from "../../hooks/useNotification";

function Nav() {
  const { currentUser } = useAuth();
  const [overview, setOverview] = useState(0);
  const [notifications, setNotifications] = useState(0);
  const [messages, setMessages] = useState(0);
  const { getNotificationsNumber } = useNotification();
  const { getUnreadNumber } = useMessage();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const notifications = await getNotificationsNumber(currentUser.uid);
      const messages = await getUnreadNumber(currentUser.uid);
      setNotifications(notifications);
      setMessages(messages);
      setOverview(notifications + messages);
    })();
  }, []);

  return (
    <Wrapper>
      <Container>
        <NavLink to="/inbox" isSelected={location.pathname === "/inbox"}>
          Overview
          {overview !== 0 && <Notification>{overview}</Notification>}
        </NavLink>
        <NavLink
          to="/inbox/notifications"
          isSelected={location.pathname === "/inbox/notifications"}
        >
          Notifications
          {notifications !== 0 && <Notification>{notifications}</Notification>}
        </NavLink>
        <NavLink
          to="/inbox/messages"
          isSelected={location.pathname === "/inbox/messages"}
        >
          Messages
          {messages !== 0 && <Notification>{messages}</Notification>}
        </NavLink>
      </Container>
    </Wrapper>
  );
}

export default Nav;

const Wrapper = styled.div`
  width: 100%;
  background: ${(props) => props.theme.backgroundSecondary};
`;

const Container = styled.nav`
  display: flex;
  justify-content: space-around;
  padding-top: 0.5rem;
  background: ${(props) => props.theme.backgroundSecondary};
  margin: 0 auto;
  max-width: 40rem;

  & > * {
    flex: 1;
  }
`;

const NavLink = styled(Link)`
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${(props) => props.isSelected && "500"};
  color: ${(props) => props.isSelected && props.theme.accent};
  border-bottom: ${(props) =>
    props.isSelected
      ? `2px solid ${props.theme.accent}`
      : "2px solid transparent"};

  & > *:first-child {
    margin-right: 0.5rem;
  }
`;

const Notification = styled.span`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: ${(props) => props.theme.accent};
  color: white;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.75rem;
`;
