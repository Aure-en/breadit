import { firestore } from "../firebase";
import useUser from "./useUser";

function useNotification() {
  const { getUserByName } = useUser();

  const createNotification = async (
    type,
    user,
    author,
    post,
    subreadit,
    content
  ) => {
    const ref = await firestore.collection("notifications").doc();
    ref.set({
      user: {
        // The user receiving the notification
        id: user.id,
        name: user.name,
      },
      author: {
        // The user writing the post / comment leading to the notification
        id: author.id,
        name: author.name,
      },
      type, // "mention", "reply" or "comment"
      post: {
        id: post.id,
        title: post.title,
        date: post.date,
        author: {
          id: post.author.id,
          name: post.author.name,
        },
        type: post.type, // "post", "image" or "link"
      },
      subreadit: {
        id: subreadit.id,
        name: subreadit.name,
      },
      content: {
        type: content.type, // "post" or "comment"
        content: content.content,
        id: content.id,
      },
      date: new Date(),
      read: false,
      id: ref.id,
    });
  };

  const deleteNotification = (id) => {
    return firestore.collection("notifications").doc(id).delete();
  };

  const readNotifications = async (userId) => {
    const query = await firestore
      .collection("notifications")
      .where("user.id", "==", userId)
      .where("read", "==", false)
      .get();
    query.forEach((doc) => doc.ref.update({ read: true }));
  };

  const getAllNotifications = async (userId) => {
    const notificationsArr = [];
    const notifications = await firestore
      .collection("notifications")
      .where("user.id", "==", userId)
      .orderBy("date")
      .get();
    notifications.docs.forEach((notification) =>
      notificationsArr.push(notification.data())
    );
    return notificationsArr;
  };

  const getNotifications = async (userId, limit) => {
    const notificationsArr = [];
    const notifications = await firestore
      .collection("notifications")
      .where("user.id", "==", userId)
      .orderBy("date")
      .limit(limit)
      .get();
    notifications.docs.forEach((notification) =>
      notificationsArr.push(notification.data())
    );
    return notificationsArr;
  };

  const getNotificationsNumber = async (userId) => {
    const notifications = await firestore
      .collection("notifications")
      .where("user.id", "==", userId)
      .where("read", "==", false)
      .get();
    return notifications.docs.length;
  };

  const notifyMention = async (author, post, subreadit, content) => {
    const MENTION_REGEX = /\bu\/[-_a-zA-Z0-9]+\b/gi;
    let matches = content.content.match(MENTION_REGEX) || [];
    matches = matches.map((match) => match.slice(2).toLowerCase());
    matches = matches.filter((match) => match !== author.name.toLowerCase()); // Delete author
    matches = Array.from(new Set(matches)); // Delete duplicates.

    // Look for the users
    let mentionedUsers = await Promise.all(
      matches.map(async (match) => {
        const user = await getUserByName(match);
        return user;
      })
    );

    // If they haven't been found, we delete them from the mentionedUsers array.
    mentionedUsers = mentionedUsers.filter((user) => user !== undefined);

    mentionedUsers.map((user) => {
      createNotification(
        // type
        "mention",
        // user
        { id: user.id, name: user.username },
        author,
        post,
        subreadit,
        content
      );
    });
  };

  const notificationsListener = (userId, callback) => {
    return firestore
      .collection("notifications")
      .where("user.id", "==", userId)
      .onSnapshot(callback);
  };

  return {
    createNotification,
    deleteNotification,
    readNotifications,
    getNotifications,
    getAllNotifications,
    getNotificationsNumber,
    notifyMention,
    notificationsListener,
  };
}

export default useNotification;
