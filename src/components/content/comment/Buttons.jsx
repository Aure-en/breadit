import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useSave } from "../../../contexts/SaveContext";

// Icons
import { ReactComponent as IconSave } from "../../../assets/icons/general/icon-save.svg";
import { ReactComponent as IconSaved } from "../../../assets/icons/general/icon-save-filled.svg";
import { ReactComponent as IconReply } from "../../../assets/icons/content/icon-reply.svg";

function Buttons({ user, commentId, onReplyClick }) {
  const { saved, handleSave } = useSave();

  return (
    <Container>
      <Button type="button" onClick={onReplyClick}>
        <IconReply />
        Reply
      </Button>
      <Button
        type="button"
        onClick={() => handleSave(user.uid, commentId, "comment")}
      >
        {saved.includes(commentId) ? <IconSaved /> : <IconSave />}
        Save
      </Button>
    </Container>
  );
}

export default Buttons;

Buttons.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
  }),
  commentId: PropTypes.string.isRequired,
  onReplyClick: PropTypes.func,
};

Buttons.defaultProps = {
  user: null,
  onReplyClick: () => {},
};

const Container = styled.div`
  display: flex;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.secondary};
  padding: 0.5rem 0;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  & > button:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }

  @media all and (min-width: 768px) {
    padding: 0.5rem 0;
  }
`;

const Button = styled.button`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.secondary};

  & > *:first-child {
    margin-right: 0.15rem;
  }

  & > a {
    height: 100%;
  }
`;
