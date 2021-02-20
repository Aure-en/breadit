import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { firestore } from "../firebase";
import { useAuth } from "./AuthContext";

const SubscriptionContext = React.createContext();

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }) {
  const { currentUser } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);

  const getSubscriptions = async (userId) => {
    const subscriptionsArr = [];
    const subreadits = await firestore
      .collection("users")
      .doc(userId)
      .collection("subreadits")
      .get();
    subreadits.docs.forEach((subreadit) => subscriptionsArr.push(subreadit.id));
    return subscriptionsArr;
  };

  useEffect(() => {
    if (!currentUser) {
      setSubscriptions([]);
      return;
    }
    const unsubscribe = firestore
      .collection("users")
      .doc(currentUser.uid)
      .collection("subreadits")
      .onSnapshot(async () => {
        const subscriptions = await getSubscriptions(currentUser.uid);
        setSubscriptions(subscriptions);
      });
    return unsubscribe;
  }, [currentUser]);

  const value = {
    subscriptions,
  };

  SubscriptionProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}
