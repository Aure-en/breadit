import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useMessage from "../../hooks/useMessage";
import useNotification from "../../hooks/useNotification";

// Icons
import { ReactComponent as IconInbox } from "../../assets/icons/header/icon-inbox.svg";

function LinkInbox() {
  const { currentUser } = useAuth();
  const [number, setNumber] = useState(0);
  const { getNotificationsNumber, readNotifications } = useNotification();
  const { getUnreadNumber, readMessages } = useMessage();

  useEffect(() => {
    (async () => {
      const notifications = await getNotificationsNumber(currentUser.uid);
      const messages = await getUnreadNumber(currentUser.uid);
      setNumber(notifications + messages);
    })();
  }, []);

  const handleRead = () => {
    readNotifications(currentUser.uid);
    readMessages(currentUser.uid);
    setNumber(0);
  };

  return (
    <LinkIcon to="/inbox" data-tip="Inbox" onClick={handleRead}>
      {number !== 0 && <Number>{number}</Number>}
      <IconInbox />
    </LinkIcon>
  );
}

export default LinkInbox;

const LinkIcon = styled(Link)`
  position: relative;
`;

const Number = styled.div`
  position: absolute;
  top: -1rem;
  right: -.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: ${(props) => props.theme.accent};
  color: white;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
