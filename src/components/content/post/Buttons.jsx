import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CommentButton from "../shared/buttons/CommentButton";
import SaveButton from "../shared/buttons/SaveButton";
import HideButton from "../shared/buttons/HideButton";
import ShareButton from "../shared/buttons/ShareButton";

function Buttons({ postId, subreadit, hide, isPreview, className }) {
  return (
    <Container className={className}>
      <CommentButton subreadit={subreadit} postId={postId} />
      <SaveButton docId={postId} type="post" />
      {isPreview && <ShareButton copy={`${subreadit}/${postId}`} />}
      {hide && <HideButton setHide={hide} />}
    </Container>
  );
}

export default Buttons;

Buttons.propTypes = {
  postId: PropTypes.string.isRequired,
  subreadit: PropTypes.string.isRequired,
  hide: PropTypes.func,
  className: PropTypes.string,
  isPreview: PropTypes.bool,
};

Buttons.defaultProps = {
  className: "",
  hide: null,
  isPreview: false,
};

const Container = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.text_secondary};
  display: flex;
  align-items: stretch;

  @media all and (min-width: 768px) {
    padding: 0.5rem 0;
  }

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
