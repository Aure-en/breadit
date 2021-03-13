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
import useLoading from "../../hooks/useLoading";

function Overview() {
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState();
  const { currentUser } = useAuth();
  const { getAllMessages, deleteMessageListener, readMessages } = useMessage();
  const {
    getAllNotifications,
    deleteNotificationListener,
    readNotifications,
  } = useNotification();
  const { getCommentsNumber } = useComment();
  const { getPost } = usePost();
  const listRef = useRef();
  const { limit } = useScroll(listRef, 20, 10);
  const notificationsLoading = useLoading(notifications);
  const messagesLoading = useLoading(messages);

  const formatNotifications = async (notifications) => {
    return Promise.all(
      notifications.map(async (notification) => {
        if (notification.document.type === "comment") {
          const post = await getPost(notification.content.post.id);
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

  // Mark the new messages and notifications as "read"
  useEffect(() => {
    readNotifications(currentUser.uid);
    readMessages(currentUser.uid);
  }, []);

  useEffect(() => {
    if (!notificationsLoading && !messagesLoading) {
      setLoading(false);
    }
  }, [all]);

  return (
    <>
      {!loading && (
        <>
          {overview && (
            <>
              {overview.length > 0 ? (
                <List ref={listRef}>
                  {overview.map((doc) => {
                    if (messages.includes(doc)) {
                      return (
                        <Message
                          key={doc.id}
                          id={doc.id}
                          sender={doc.sender}
                          recipient={doc.recipient}
                          content={doc.content}
                          date={doc.date}
                          isSent={false}
                        />
                      );
                    }
                    if (notifications.includes(doc)) {
                      return doc.document.type === "post" ? (
                        <PostNotification
                          key={doc.id}
                          id={doc.id}
                          content={doc.content}
                        />
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
              ) : (
                <Empty>
                  <h4>Nothing to see here.</h4>
                  Chat with others to fill your inbox.
                </Empty>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default Overview;

const List = styled.div`
  margin-top: 0.5rem;
  width: 100vw;
  max-width: 100%;

  & > * {
    display: block;
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

const Empty = styled.div`
  margin-top: 0.5rem;
  width: 100vw;
  max-width: 100%;
  background: ${(props) => props.theme.bg_container};
  border-bottom: 1px solid ${(props) => props.theme.border};
  border-top: 1px solid ${(props) => props.theme.border};
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  padding: 1rem;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media all and (min-width: 768px) {
    border: 1px solid ${(props) => props.theme.border};
    align-items: center;
    margin: 1rem;
    max-width: 40rem;
  }
`;
