import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import useScroll from "../../hooks/useScroll";
import useMessage from "../../hooks/useMessage";
import useNotification from "../../hooks/useNotification";
import usePost from "../../hooks/usePost";
import useComment from "../../hooks/useComment";
import Message from "../../components/inbox/messages/Message";
import PostNotification from "../../components/inbox/notifications/PostNotification";
import CommentNotification from "../../components/inbox/notifications/CommentNotification";

function Overview() {
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [all, setAll] = useState([]);
  const [overview, setOverview] = useState([]);
  const { currentUser } = useAuth();
  const { getAllMessages, deleteMessageListener } = useMessage();
  const { getAllNotifications, deleteNotificationListener } = useNotification();
  const { getCommentsNumber } = useComment();
  const { getPost } = usePost();
  const listRef = useRef();
  const { limit } = useScroll(listRef, 20, 10);

  const formatNotifications = async (notifications) => {
    return Promise.all(
      notifications.map(async (notification) => {
        if (notification.document.type === "comment") {
          const post = await getPost(notification.content.post);
          return { ...notification, post: post.data() };
        }
        const comments = await getCommentsNumber(notification.content.id);
        const newNotification = { ...notification };
        newNotification.content.comments = comments;
        return newNotification;
      })
    );
  };

  // Gets messages and notifications.
  useEffect(() => {
    (async () => {
      const messages = await getAllMessages(currentUser.uid);
      setMessages(messages);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let notifications = await getAllNotifications(currentUser.uid);
      notifications = await formatNotifications(notifications);
      setNotifications(notifications);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setAll([...messages, ...notifications].sort((a, b) => b.date - a.date));
    })();
  }, [messages, notifications]);

  // Loads more message after scrolling
  useEffect(() => {
    setOverview([...all].slice(0, limit));
  }, [all, limit]);

  // Refresh the list when the user deletes a notification.
  useEffect(() => {
    const callback = (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "removed") {
          let notifications = await getAllNotifications(currentUser.uid, limit);
          notifications = await formatNotifications(notifications);
          setNotifications(notifications);
        }
      });
    };
    const unsubscribe = deleteNotificationListener(currentUser.uid, callback);
    return unsubscribe;
  }, []);

  // Refresh the list when the user deletes a message.
  useEffect(() => {
    const callback = (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "modified" && change.doc.data().deleted) {
          const received = await getAllMessages(currentUser.uid, limit);
          setMessages(received);
        }
      });
    };
    const unsubscribe = deleteMessageListener(currentUser.uid, callback);
    return unsubscribe;
  }, []);

  return (
    <List ref={listRef}>
      {overview.map((doc) => {
        if (messages.includes(doc)) {
          return (
            <Message
              key={doc.id}
              id={doc.id}
              sender={doc.sender}
              content={doc.content}
              date={doc.date}
              isSent={false}
            />
          );
        }
        if (notifications.includes(doc)) {
          return doc.document.type === "post" ? (
            <PostNotification key={doc.id} id={doc.id} content={doc.content} />
          ) : (
            <CommentNotification
              key={doc.id}
              id={doc.id}
              type={doc.type}
              date={doc.date}
              content={doc.content}
              post={doc.post}
            />
          );
        }
      })}
    </List>
  );
}

export default Overview;

const List = styled.div`
  & > * {
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
