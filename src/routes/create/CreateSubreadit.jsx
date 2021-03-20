import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import useSubreadit from "../../hooks/useSubreadit";

function CreateSubreadit() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();
  const { createSubreadit, isNameAvailable } = useSubreadit();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError("");
    setDescriptionError("");
    setMessage("");

    // Form verification
    if (!name) {
      setNameError("A Community Name is required.");
      return;
    }

    if (!name.match(/^[a-zA-Z0-9_]+$/)) {
      setNameError("Make sure your Community Name follows all the formatting rules.");
      return;
    }

    const availability = await isNameAvailable(name);
    if (!availability) {
      setNameError("This Community Name is already taken.");
      return;
    }

    if (!description) {
      setDescriptionError("A Community Description is required.");
      return;
    }

    try {
      createSubreadit(name, description, currentUser);
      setMessage(
        "Your Subreadit has been created. You will be redirected shortly."
      );
      setTimeout(() => history.push(`/b/${name.toLowerCase()}`), 1000);
    } catch (err) {
      setMessage("Sorry, something went wrong. Please try again later.");
    }
  };

  return (
    <Container>
      <h3>Create a Subreadit</h3>
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="name">Name</Label>
          <Message>
            Community names including capitalization cannot be changed. <br />
            Names cannot have spaces and can only includes letters, numbers and "_".
          </Message>

          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            name="name"
          />
          <Error>{nameError}</Error>
        </Field>

        <Field>
          <Label htmlFor="description">Description</Label>
          <Message>
            This is how new members come to understand your community.
          </Message>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            name="description"
          />
          <Error>{descriptionError}</Error>
        </Field>

        <Button type="submit">Create Community</Button>
        <Message>{message}</Message>
      </Form>
    </Container>
  );
}

export default CreateSubreadit;

const Container = styled.div`
  width: 100%;
  max-width: 40rem;
  margin: 3rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.bg_container};
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 0 10px -5px ${(props) => props.theme.vote_neutral};
`;

const Field = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${(props) => props.theme.accent_secondary};
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid ${(props) => props.theme.border_secondary};
  padding: 0.5rem;
  border-radius: 5px;
  color: ${(props) => props.theme.text_primary};
  background: ${(props) => props.theme.input_bg};

  &:focus {
    outline: 1px solid transparent;
    border: 1px solid ${(props) => props.theme.border_active};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  border: 1px solid ${(props) => props.theme.border_secondary};
  padding: 0.5rem;
  border-radius: 5px;
  color: ${(props) => props.theme.text_primary};
  background: ${(props) => props.theme.input_bg};

  &:focus {
    outline: 1px solid transparent;
    border: 1px solid ${(props) => props.theme.border_active};
  }
`;

const Message = styled.div`
  position: relative;
  font-size: 0.75rem;
  color: ${(props) => props.theme.text_secondary};
  line-height: 0.85rem;
  margin-bottom: 0.5rem;
`;

const Error = styled(Message)`
  color: ${(props) => props.theme.error};
`;

const Button = styled.button`
  align-self: flex-end;
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  color: ${(props) => props.theme.bg_container};
  background: ${(props) => props.theme.accent_secondary};
  border: 1px solid transparent;
`;
