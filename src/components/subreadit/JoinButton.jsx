import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useSubreadit from "../../hooks/useSubreadit";
import { useEntry } from "../../contexts/EntryContext";

function JoinButton({ subscriptions, subreadit, user }) {
  const [isHovered, setIsHovered] = useState();
  const { openSignUp } = useEntry();
  const { joinSubreadit, leaveSubreadit } = useSubreadit();

  return (
    <>
      {!subscriptions.includes(subreadit.id) ? (
        <ButtonFilled
          type="button"
          onClick={() =>
            user ? joinSubreadit(user.uid, subreadit) : openSignUp()
          }
        >
          Join
        </ButtonFilled>
      ) : (
        <Button
          type="button"
          onMouseEnter={() => setIsHovered(subreadit.id)}
          onMouseLeave={() => setIsHovered("")}
          onClick={() => leaveSubreadit(user.uid, subreadit)}
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
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
  width: 6rem;
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.backgroundSecondary};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};

  &::disabled {
    background-color: ${(props) => props.theme.disabled};
    border: 1px solid ${(props) => props.theme.disabled};
  }
`;
