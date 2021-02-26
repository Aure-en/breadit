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
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useAuth();
  const { getNotifications, deleteNotificationListener } = useNotification();
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

  useEffect(() => {
    (async () => {
      let notifications = await getNotifications(currentUser.uid, limit);
      notifications = await formatNotifications(notifications);
      setNotifications(notifications);
    })();
  }, [limit]);

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

  return (
    <div>
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
    </div>
  );
}

export default Notifications;

const List = styled.div`
  & > * {
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
