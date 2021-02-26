import { firestore } from "../firebase";
import useUser from "./useUser";

function useNotification() {
  const { getUserByName } = useUser();

  const createNotification = async (user, type, document, content) => {
    const ref = await firestore.collection("notifications").doc();
    ref.set({
      user: {
        id: user.id,
        name: user.name,
      },
      type,
      document,
      content,
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
    const notifications = await getNotifications(userId);
    return notifications.length;
  };

  const notifyMention = async (author, content, id, data, type) => {
    const MENTION_REGEX = /\bu\/[-_a-zA-Z0-9]+\b/gi;
    let matches = content.match(MENTION_REGEX) || [];
    matches = matches.map((match) => match.slice(2).toLowerCase());
    matches = matches.filter((match) => match !== author.toLowerCase()); // Delete author
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
        {
          id: user.id,
          name: user.username,
        },
        "mention",
        { type, id },
        data
      );
    });
  };

  const deleteNotificationListener = (userId, callback) => {
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
    deleteNotificationListener,
  };
}

export default useNotification;
