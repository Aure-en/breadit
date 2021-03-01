import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import useMessage from "../../hooks/useMessage";
import useUser from "../../hooks/useUser";
import TextEditor from "../../components/shared/TextEditor";

function CreateMessage() {
  const [recipient, setRecipient] = useState("");
  const [recipientError, setRecipientError] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();
  const { getUserByName } = useUser();
  const { sendMessage } = useMessage();

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
          <Error>{recipientError}</Error>
        </Field>

        <Field>
          <TextEditor type="post" sendContent={setContent} />
        </Field>

        <Button type="submit" disabled={!(recipient && content)}>
          Send
        </Button>
        <Message>{message}</Message>
      </Form>
    </Container>
  );
}

export default CreateMessage;

const Container = styled.main``;

const Form = styled.form``;

const Field = styled.div``;

const Input = styled.input``;

const Message = styled.div``;

const Error = styled(Message)``;

const Button = styled.button``;
