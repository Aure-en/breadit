import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ShareButton from "../../../content/shared/buttons/ShareButton";
import SaveButton from "../../../content/shared/buttons/SaveButton";

// Icons
import { ReactComponent as IconReply } from "../../../../assets/icons/content/icon-reply.svg";

function Buttons({ commentId, postId, subreadit }) {
  return (
    <>
      <Container>
        <Button as={Link} to={`/b/${subreadit}/${postId}/${commentId}`}>
          <IconReply />
          View
        </Button>
        <SaveButton docId={commentId} type="comment" />
        <ShareButton copy={`${subreadit}/${postId}/${commentId}`} />
      </Container>
    </>
  );
}

export default Buttons;

Buttons.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
  }),
  commentId: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  subreadit: PropTypes.string.isRequired,
};

Buttons.defaultProps = {
  user: null,
};

const Container = styled.div`
  display: flex;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.text_secondary};
  padding: 0.5rem 0;
  margin-left: 0.5rem;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  @media all and (min-width: 768px) {
    padding: 0.5rem 0;
  }
`;

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

  &:hover {
    background: ${(props) => props.theme.vote_bg};
  }
`;
