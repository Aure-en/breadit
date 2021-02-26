import React, { useState } from "react";
import PropTypes from "prop-types";
import redraft from "redraft";
import styled from "styled-components";
import { Link } from "react-router-dom";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { useAuth } from "../../../contexts/AuthContext";
import useMessage from "../../../hooks/useMessage";
import TextEditor, { renderers } from "../../TextEditor";

function Message({ id, sender, content, date, isSent }) {
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState("");
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();
  const { sendMessage, deleteMessage } = useMessage();

  const handleReply = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await sendMessage(
        {
          id: currentUser.uid,
          name: currentUser.displayName,
        },
        {
          id: sender.id,
          name: sender.name,
        },
        reply
      );
      setMessage("Your message has been sent.");
      setReply("");
    } catch (err) {
      setMessage("Sorry, we were unable to send your message.");
    }
  };

  return (
    <Container>
      <Informations>
        <UserLink to={`/u/${sender.name}`}>{sender.name}</UserLink>
        <span>
          &nbsp;•&nbsp;
          {formatDistanceStrict(new Date(date.seconds * 1000), new Date())}
        </span>
      </Informations>

      <Content>{redraft(JSON.parse(content), renderers)}</Content>

      {!isSent && (
        <Buttons>
          <Button type="button" onClick={() => setIsReplying(!isReplying)}>
            Reply
          </Button>
          <Button type="button" onClick={() => deleteMessage(id)}>
            Delete
          </Button>
        </Buttons>
      )}

      {isReplying && (
        <form onSubmit={handleReply}>
          <TextEditor type="comment" sendContent={setReply} />
          <div>{message}</div>
          <Buttons>
            <Button type="submit" disabled={!reply}>
              Send
            </Button>
            <Button type="button" onClick={() => setIsReplying(false)}>
              Cancel
            </Button>
          </Buttons>
        </form>
      )}
    </Container>
  );
}

export default Message;

Message.propTypes = {
  id: PropTypes.string.isRequired,
  sender: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  date: PropTypes.shape({
    seconds: PropTypes.number,
  }).isRequired,
  content: PropTypes.string.isRequired,
  isSent: PropTypes.bool,
};

Message.defaultProps = {
  isSent: false,
};

const Container = styled.div``;

const Content = styled.div``;

const Informations = styled.div``;

const Buttons = styled.div``;

const Button = styled.button``;

const UserLink = styled(Link)``;
