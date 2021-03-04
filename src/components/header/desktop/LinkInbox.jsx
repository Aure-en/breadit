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
  const { getNotificationsNumber } = useNotification();
  const { getUnreadNumber } = useMessage();

  useEffect(() => {
    (async () => {
      const notifications = await getNotificationsNumber(currentUser.uid);
      const messages = await getUnreadNumber(currentUser.uid);
      setNumber(notifications + messages);
    })();
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
`;

const Notification = styled.span`
  position: absolute;
  top: -1rem;
  right: -0.5rem;
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
