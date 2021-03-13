import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import ShareButton from "../shared/buttons/ShareButton";
import CommentButton from "../shared/buttons/CommentButton";
import SaveButton from "../shared/buttons/SaveButton";
import HideButton from "../shared/buttons/HideButton";

function Buttons({ postId, subreadit, hide, className }) {
  return (
    <Container className={className}>
      <CommentButton subreadit={subreadit} postId={postId} />
      <SaveButton docId={postId} type="post" />
      <ShareButton copy={`${subreadit}/${postId}`} />
      <HideButton onHide={hide} />
    </Container>
  );
}

export default Buttons;

Buttons.propTypes = {
  postId: PropTypes.string.isRequired,
  subreadit: PropTypes.string.isRequired,
  hide: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Buttons.defaultProps = {
  className: "",
};

const Container = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.text_secondary};
  display: flex;
  align-items: stretch;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  & > *:hover {
    background: ${(props) => props.theme.vote_bg};
  }
`;
