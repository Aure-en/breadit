import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthContext";
import useMessage from "../../../hooks/useMessage";
import useScroll from "../../../hooks/useScroll";
import Message from "../../../components/inbox/messages/Message";

function Received() {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();
  const { getMessages, deleteMessageListener } = useMessage();
  const listRef = useRef();
  const { limit } = useScroll(listRef, 20, 10);

  // When the user deletes the message, hides it from them.
  useEffect(() => {
    const callback = (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "modified" && change.doc.data().deleted) {
          const received = await getMessages(currentUser.uid, limit);
          setMessages(received);
        }
      });
    };
    const unsubscribe = deleteMessageListener(currentUser.uid, callback);
    return unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      const received = await getMessages(currentUser.uid, limit);
      setMessages(received);
    })();
  }, [limit]);

  return (
    <List ref={listRef}>
      {messages.map((message) => {
        return (
          <Message
            key={message.id}
            id={message.id}
            sender={message.sender}
            content={message.content}
            date={message.date}
            isSent={false}
          />
        );
      })}
    </List>
  );
}

export default Received;

const List = styled.div`
  & > * {
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
