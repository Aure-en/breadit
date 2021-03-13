import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEntry } from "../../../../contexts/EntryContext";

import { ReactComponent as IconReply } from "../../../../assets/icons/content/icon-reply.svg";

function ReplyButton({ onReply }) {
  const { currentUser } = useAuth();
  const { openSignUp } = useEntry();

  return (
    <Button
      type="button"
      onClick={() => {
        currentUser ? onReply() : openSignUp();
      }}
    >
      <IconReply />
      Reply
    </Button>
  );
}

export default ReplyButton;

ReplyButton.propTypes = {
  onReply: PropTypes.func.isRequired,
};

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
