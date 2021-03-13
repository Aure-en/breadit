import React, { useState } from "react";
import PropTypes from "prop-types";
import redraft from "redraft";
import styled from "styled-components";
import { Link } from "react-router-dom";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { useAuth } from "../../../contexts/AuthContext";
import useMessage from "../../../hooks/useMessage";
import TextEditor, { renderers } from "../../shared/TextEditor";

// Icons
import { ReactComponent as IconReply } from "../../../assets/icons/content/icon-reply.svg";
import { ReactComponent as IconDelete } from "../../../assets/icons/content/icon-delete.svg";

function Message({ id, sender, recipient, content, date, isSent }) {
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
        {currentUser.uid === sender.id ? (
          <>
            {"Message sent to "}
            <UserLink to={`/u/${recipient.name}`}>{recipient.name}</UserLink>
          </>
        ) : (
          <>
            <UserLink to={`/u/${sender.name}`}>{sender.name}</UserLink>
            {" sent you a private message"}
          </>
        )}
        {" • "}
        {formatDistanceStrict(new Date(date.seconds * 1000), new Date())} ago
      </Informations>

      <Content>{redraft(JSON.parse(content), renderers)}</Content>

      {!isSent && (
        <Buttons>
          <Button type="button" onClick={() => setIsReplying(!isReplying)}>
            <IconReply />
            Reply
          </Button>
          <Button type="button" onClick={() => deleteMessage(id)}>
            <IconDelete />
            Delete
          </Button>
        </Buttons>
      )}

      {isReplying && (
        <Form onSubmit={handleReply}>
          <TextEditor
            type="comment"
            sendContent={setReply}
            placeholder="What are your thoughts?"
          />

          {message === "Your message has been sent." && (
            <MessageSuccess>{message}</MessageSuccess>
          )}
          {message === "Sorry, we were unable to send your message." && (
            <MessageError>{message}</MessageError>
          )}

          <ButtonsForm>
            <ButtonFilled type="submit" disabled={!reply}>
              Send
            </ButtonFilled>
            <ButtonForm type="button" onClick={() => setIsReplying(false)}>
              Cancel
            </ButtonForm>
          </ButtonsForm>
        </Form>
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
  recipient: PropTypes.shape({
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

const Container = styled.div`
  display: block;
  border-bottom: 1px solid ${(props) => props.theme.border};
  border-top: 1px solid ${(props) => props.theme.border};
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  background: ${(props) => props.theme.bg_container};
  cursor: pointer;
  padding: 0.5rem;
  box-shadow: 0 0 10px -5px ${(props) => props.theme.shadow};

  &:hover {
    border-bottom: 1px solid ${(props) => props.theme.border_active};
    border-top: 1px solid ${(props) => props.theme.border_active};
  }

  @media all and (min-width: 40rem) {
    border: 1px solid ${(props) => props.theme.border};

    &:hover {
      border: 1px solid ${(props) => props.theme.border_active};
    }
  }
`;

const Content = styled.div``;

const Informations = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.text_secondary};
`;

const Buttons = styled.div`
  display: flex;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  & > *:hover {
    background: ${(props) => props.theme.vote_bg};
  }
`;

const Button = styled.button`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.text_secondary};

  & > *:first-child {
    margin-right: 0.15rem;
  }

  & > a {
    height: 100%;
  }
`;

const UserLink = styled(Link)`
  color: ${(props) => props.theme.accent};

  &:hover {
    text-decoration: underline;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0.75rem 0;
`;

const ButtonsForm = styled.div`
  display: flex;
  align-self: flex-end;
  margin-top: 1rem;

  & > button:first-child {
    margin-right: 0.5rem;
  }
`;

const ButtonForm = styled.button`
  display: block;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
  text-align: center;
`;

const ButtonFilled = styled(ButtonForm)`
  color: ${(props) => props.theme.bg_container};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};

  &:disabled {
    background-color: ${(props) => props.theme.accent_disabled};
    border: 1px solid ${(props) => props.theme.accent_disabled};
    cursor: not-allowed;
  }
`;

const MessageSuccess = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.success};
`;

const MessageError = styled(MessageSuccess)`
  color: ${(props) => props.theme.error};
`;
