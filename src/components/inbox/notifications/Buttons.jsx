import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import useNotification from "../../../hooks/useNotification";

// Icons
import { ReactComponent as IconView } from "../../../assets/icons/content/icon-reply.svg";
import { ReactComponent as IconDelete } from "../../../assets/icons/content/icon-delete.svg";

function Buttons({ subreadit, notificationId, postId, commentId }) {
  const { deleteNotification } = useNotification();

  return (
    <Container>
      {commentId ? (
        <Button as={Link} to={`/b/${subreadit}/${postId}/${commentId}`}>
          <IconView />
          View
        </Button>
      ) : (
        <Button as={Link} to={`/b/${subreadit}/${postId}`}>
          <IconView />
          View
        </Button>
      )}

      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          deleteNotification(notificationId);
        }}
      >
        <IconDelete />
        Delete
      </Button>
    </Container>
  );
}

export default Buttons;

Buttons.propTypes = {
  subreadit: PropTypes.string.isRequired,
  notificationId: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  commentId: PropTypes.string,
};

Buttons.defaultProps = {
  commentId: "",
};

const Container = styled.div`
  display: flex;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  & > *:hover {
    background: ${(props) => props.theme.vote_bg};
  }

  & > *:last-child {
    padding-right: 0;
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
`;
