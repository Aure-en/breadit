import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthContext";
import useUserSettings from "../../../hooks/useUserSettings";

const colors = {
  primary: "black",
  secondary: "grey",
  accent: "red",
  disabled: "blue",
  background: "white",
  overlay: "rgba(0, 0, 0, .8)",
};

const Textarea = styled.textarea`
  width: 100%;
  min-height: 8rem;
`;

const Message = styled.div`
  font-size: 0.75rem;
  color: ${colors.secondary};
  margin-bottom: 0.5rem;
`;

const ButtonsRight = styled.div`
  display: flex;
  justify-content: flex-end;

  & > * {
    margin-left: 1rem;
  }

  & > *:first-child {
    margin-left: 0;
  }
`;

const Button = styled.button`
  border: 1px solid ${colors.accent};
  color: ${colors.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
`;

const ButtonFilled = styled(Button)`
  color: ${colors.background};
  background-color: ${colors.accent};
  border: 1px solid ${colors.accent};

  &::disabled {
    background-color: ${colors.disabled};
    border: 1px solid ${colors.disabled};
  }
`;

function About({ prevAbout }) {
  const [about, setAbout] = useState(prevAbout);
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();
  const { updateAbout } = useUserSettings();

  const handleUpdateAbout = async () => {
    try {
      updateAbout(currentUser.uid, about);
      setMessage("Your description was successfully updated.");
    } catch (err) {
      setMessage("Sorry, we were unable to update your description.");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleUpdateAbout();
      }}
    >
      <label htmlFor="about">
        <Textarea
          id="about"
          name="about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </label>
      <Message>{message}</Message>
      <ButtonsRight>
        <ButtonFilled type="submit">Save</ButtonFilled>
      </ButtonsRight>
    </form>
  );
}

About.propTypes = {
  prevAbout: PropTypes.string,
};

About.defaultProps = {
  prevAbout: "",
};

export default About;
