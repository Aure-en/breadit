import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styled from "styled-components";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameError("");
    setDescriptionError("");
    setMessage("");

    // Form verification
    if (!name) {
      setNameError("A Community Name is required.");
      return;
    }

    if (!isNameAvailable(name)) {
      setNameError("This Community Name is already taken.");
      return;
    }

    if (!description) {
      setDescriptionError("A Community Description is required.");
      return;
    }

    try {
      createSubreadit(name, description, currentUser.uid);
      setMessage(
        "Your Subreadit has been created. You will be redirected shortly."
      );
      setTimeout(() => history.push(`/b/${name}`), 1000);
    } catch (err) {
      setMessage("Sorry, something went wrong. Please try again later.");
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="name">Name</Label>
          <Message>
            Community names including capitalization cannot be changed.
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
    </div>
  );
}

export default CreateSubreadit;

const Form = styled.form``;

const Field = styled.div``;

const Label = styled.label``;

const Input = styled.input``;

const Textarea = styled.textarea``;

const Message = styled.div``;

const Error = styled(Message)``;

const Button = styled.button``;
