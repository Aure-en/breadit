import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthContext";
import useMessage from "../../../hooks/useMessage";
import useScroll from "../../../hooks/useScroll";
import useLoading from "../../../hooks/useLoading";
import Message from "../../../components/inbox/messages/Message";

function Sent() {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();
  const { getSentMessages } = useMessage();
  const listRef = useRef();
  const { limit } = useScroll(listRef, 20, 10);
  const loading = useLoading(messages);

  useEffect(() => {
    (async () => {
      const sent = await getSentMessages(currentUser.uid, limit);
      setMessages(sent);
    })();
  }, [limit]);

  return (
    <>
      {!loading && (
        <>
          {messages && (
            <>
              {messages.length > 0 ? (
                <List ref={listRef}>
                  {messages.map((message) => {
                    return (
                      <Message
                        key={message.id}
                        id={message.id}
                        sender={message.sender}
                        recipient={message.recipient}
                        content={message.content}
                        date={message.date}
                        isSent
                      />
                    );
                  })}
                </List>
              ) : (
                <Empty>
                  <h4>Nothing to see here.</h4>
                  Send a message to see it displayed here
                </Empty>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default Sent;

const List = styled.div`
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
