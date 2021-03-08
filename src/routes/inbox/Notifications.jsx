import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import useScroll from "../../hooks/useScroll";
import usePost from "../../hooks/usePost";
import useNotification from "../../hooks/useNotification";
import useComment from "../../hooks/useComment";
import PostNotification from "../../components/inbox/notifications/PostNotification";
import CommentNotification from "../../components/inbox/notifications/CommentNotification";

function Notifications() {
  const [notifications, setNotifications] = useState();
  const { currentUser } = useAuth();
  const {
    getNotifications,
    deleteNotificationListener,
    readNotifications,
  } = useNotification();
  const { getCommentsNumber } = useComment();
  const { getPost } = usePost();
  const listRef = useRef();
  const { limit } = useScroll(listRef, 20, 10);

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

  // Load more notifications on scroll
  useEffect(() => {
    (async () => {
      let notifications = await getNotifications(currentUser.uid, limit);
      notifications = await formatNotifications(notifications);
      setNotifications(notifications);
    })();
  }, [limit]);

  // Refresh notifications when we delete one of them
  useEffect(() => {
    const callback = (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "removed") {
          let notifications = await getNotifications(currentUser.uid, limit);
          notifications = await formatNotifications(notifications);
          setNotifications(notifications);
        }
      });
    };
    const unsubscribe = deleteNotificationListener(currentUser.uid, callback);
    return unsubscribe;
  }, []);

  // Mark the new notifications as "read"
  useEffect(() => {
    readNotifications(currentUser.uid);
  }, []);

  return (
    <>
      {notifications && (
        <>
          {notifications.length > 0 ? (
            <List ref={listRef}>
              {notifications.map((notification) => {
                return notification.document.type === "post" ? (
                  <PostNotification
                    key={notification.id}
                    id={notification.id}
                    content={notification.content}
                  />
                ) : (
                  <CommentNotification
                    key={notification.id}
                    id={notification.id}
                    type={notification.type}
                    date={notification.date}
                    content={notification.content}
                    post={notification.post}
                  />
                );
              })}
            </List>
          ) : (
            <Empty>
              <h4>Nothing to see here.</h4>
              You will be notified if someone interacts with you.
            </Empty>
          )}
        </>
      )}
    </>
  );
}

export default Notifications;

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
  background: ${(props) => props.theme.backgroundSecondary};
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
    border: 1px solid ${(props) => props.theme.neutral};
    align-items: center;
    margin: 1rem;
    max-width: 40rem;
  }
`;
