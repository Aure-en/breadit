import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthContext";
import useMessage from "../../../hooks/useMessage";
import useScroll from "../../../hooks/useScroll";
import Message from "../../../components/inbox/messages/Message";

function Sent() {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();
  const { getSentMessages } = useMessage();
  const listRef = useRef();
  const { limit } = useScroll(listRef, 20, 10);

  useEffect(() => {
    (async () => {
      const sent = await getSentMessages(currentUser.uid, limit);
      setMessages(sent);
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
            isSent
          />
        );
      })}
    </List>
  );
}

export default Sent;

const List = styled.div`
  & > * {
    margin-bottom: 0.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
