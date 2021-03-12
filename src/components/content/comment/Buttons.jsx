import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import SaveButton from "../shared/buttons/SaveButton";
import ReplyButton from "../shared/buttons/ReplyButton";

function Buttons({ commentId, onReply }) {
  return (
    <Container>
      <ReplyButton onReply={onReply} />
      <SaveButton docId={commentId} type="comment" />
    </Container>
  );
}

export default Buttons;

Buttons.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
  }),
  commentId: PropTypes.string.isRequired,
  onReply: PropTypes.func,
};

Buttons.defaultProps = {
  user: null,
  onReply: () => {},
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