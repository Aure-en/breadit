import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import useMessage from "../../../hooks/useMessage";
import useNotification from "../../../hooks/useNotification";

// Icons
import { ReactComponent as IconInbox } from "../../../assets/icons/header/icon-inbox.svg";

function LinkInbox() {
  const { currentUser } = useAuth();
  const [number, setNumber] = useState(0);
  const { getNotificationsNumber, notificationsListener } = useNotification();
  const { getUnreadNumber, messagesListener } = useMessage();

  // Listeners
  useEffect(() => {
    const unsubscribe = notificationsListener(currentUser.uid, async () => {
      const notifications = await getNotificationsNumber(currentUser.uid);
      const messages = await getUnreadNumber(currentUser.uid);
      setNumber(notifications + messages);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messagesListener(currentUser.uid, async () => {
      const notifications = await getNotificationsNumber(currentUser.uid);
      const messages = await getUnreadNumber(currentUser.uid);
      setNumber(notifications + messages);
    });
    return unsubscribe;
  }, []);

  return (
    <LinkIcon to="/inbox" data-tip="Inbox">
      {number !== 0 && <Notification>{number}</Notification>}
      <IconInbox />
    </LinkIcon>
  );
}

export default LinkInbox;

const LinkIcon = styled(Link)`
  position: relative;
  padding: 0.15rem 0.25rem;
  color: ${(props) => props.theme.header_text};

  &:hover {
    color: ${(props) => props.theme.header_text_active};
  }
`;

const Notification = styled.span`
  position: absolute;
  top: -0.15rem;
  right: -0.15rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: ${(props) => props.theme.accent};
  color: ${(props) => props.theme.bg_container};
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
