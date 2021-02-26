import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import useMessage from "../../hooks/useMessage";
import useNotification from "../../hooks/useNotification";
import Message from "../../components/inbox/messages/Message";
import PostNotification from "../../components/inbox/notifications/PostNotification";
import CommentNotification from "../../components/inbox/notifications/CommentNotification";

function Overview() {
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [overview, setOverview] = useState([]);
  const { currentUser } = useAuth();
  const { getAllMessages, deleteListener } = useMessage();
  const { getAllNotifications } = useNotification();

  // Gets messages and notifications.
  useEffect(() => {
    (async () => {
      const messages = await getAllMessages(currentUser.uid);
      setMessages(messages);
      const notifications = await getAllNotifications(currentUser.uid);
      setNotifications(notifications);
    })();
  }, []);

  return (
    <div>
      overview
    </div>
  )
}

export default Overview;
