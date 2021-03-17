import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useSubreadit from "../../hooks/useSubreadit";
import { useEntry } from "../../contexts/EntryContext";
import { toastify } from "../shared/Toast";

function JoinButton({ subscriptions, subreadit, user }) {
  const [isHovered, setIsHovered] = useState();
  const { openSignUp } = useEntry();
  const { joinSubreadit, leaveSubreadit } = useSubreadit();

  return (
    <>
      {!subscriptions.includes(subreadit.id) ? (
        <ButtonFilled
          type="button"
          onClick={() => {
            if (user) {
              joinSubreadit(user.uid, subreadit);
              toastify(`Successfully joined b/${subreadit.name}`);
            } else {
              openSignUp();
            }
          }}
        >
          Join
        </ButtonFilled>
      ) : (
        <Button
          type="button"
          onMouseEnter={() => setIsHovered(subreadit.id)}
          onMouseLeave={() => setIsHovered("")}
          onClick={() => {
            leaveSubreadit(user.uid, subreadit);
            toastify(`Successfully left b/${subreadit.name}`);
          }}
        >
          {isHovered === subreadit.id ? "Leave" : "Joined"}
        </Button>
      )}
    </>
  );
}

JoinButton.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.string),
  subreadit: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string,
  }),
};

JoinButton.defaultProps = {
  subscriptions: [],
  user: null,
};

export default JoinButton;

const Button = styled.button`
  display: block;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.35rem 1.25rem;
  font-weight: 500;
  text-align: center;
  width: 6rem;

  &:hover {
    color: ${(props) => props.theme.accent_active};
    border: 1px solid ${(props) => props.theme.accent_active};
  }
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.bg_container};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};

  &:hover {
    color: ${(props) => props.theme.bg_container};
    background-color: ${(props) => props.theme.accent_active};
    border: 1px solid ${(props) => props.theme.accent_active};
  }
  &::disabled {
    background-color: ${(props) => props.theme.disabled};
    border: 1px solid ${(props) => props.theme.disabled};
  }
`;
