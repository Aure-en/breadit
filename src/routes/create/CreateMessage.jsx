import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import useMessage from "../../hooks/useMessage";
import useUser from "../../hooks/useUser";
import TextEditor from "../../components/shared/TextEditor";

function CreateMessage({ location }) {
  const [recipient, setRecipient] = useState("");
  const [recipientError, setRecipientError] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();
  const { getUserByName } = useUser();
  const { sendMessage } = useMessage();

  // Automatically fills the recipient's username if
  // the user intended to send a message to them.
  useEffect(() => {
    if (location.recipient) setRecipient(location.recipient);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the recipient exists
    const user = await getUserByName(recipient);
    if (!user) {
      setRecipientError("This user does not exist.");
      return;
    }

    try {
      setRecipientError("");
      setMessage("");
      await sendMessage(
        {
          id: currentUser.uid,
          name: currentUser.displayName,
        },
        {
          id: user.id,
          name: user.username,
        },
        content
      );
      setMessage("Your message has been sent.");
      setRecipient("");
      setContent("");
    } catch (err) {
      setMessage("Sorry, we were unable to send your message.");
    }
  };

  return (
    <Container>
      <h2>Send a message</h2>
      <Main>
        <Form onSubmit={handleSubmit}>
          <Field>
            <label htmlFor="recipient">
              <Input
                type="text"
                id="recipient"
                name="recipient"
                value={recipient}
                placeholder="Username"
                onChange={(e) => setRecipient(e.target.value)}
              />
            </label>
            <MessageError>{recipientError}</MessageError>
          </Field>

          <Field>
            <TextEditor
              type="post"
              sendContent={setContent}
              placeholder="What are your thoughts?"
            />
          </Field>

          <Bottom>
            {message === "Your message has been sent." && (
              <MessageSuccess>{message}</MessageSuccess>
            )}
            {message === "Sorry, we were unable to send your message." && (
              <MessageError>{message}</MessageError>
            )}
            <Button type="submit" disabled={!(recipient && content)}>
              Send
            </Button>
          </Bottom>
        </Form>
      </Main>
    </Container>
  );
}

export default CreateMessage;

CreateMessage.propTypes = {
  location: PropTypes.shape({
    recipient: PropTypes.string,
  }).isRequired,
};

const Container = styled.div`
  width: 100%;
  max-width: 40rem;
  margin: 3rem 0;
`;

const Main = styled.main`
  background: ${(props) => props.theme.backgroundSecondary};
  padding: 1rem;
  margin: 2rem 0;
  border-radius: 5px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Field = styled.div`
  margin: 0.75rem 0;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 3px;
  width: 100%;
  border: 1px solid
    ${(props) => (props.hasError ? props.theme.error : props.theme.secondary)};

  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.accent};
  }
`;

const MessageSuccess = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.success};
  margin-bottom: 0.5rem;
`;

const MessageError = styled(MessageSuccess)`
  color: ${(props) => props.theme.error};
  top: -0.5rem;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  display: block;
  color: ${(props) => props.theme.backgroundSecondary};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  margin-left: 1rem;
  font-weight: 500;
  text-align: center;

  &:disabled {
    background-color: ${(props) => props.theme.accentDisabled};
    border: 1px solid ${(props) => props.theme.accentDisabled};
    cursor: not-allowed;
  }
`;
