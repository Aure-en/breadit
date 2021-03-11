import React, { useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useSave } from "../../../../contexts/SaveContext";
import { useEntry } from "../../../../contexts/EntryContext";
import { BREADIT_URL } from "../../../../utils/const";

// Icons
import { ReactComponent as IconSave } from "../../../../assets/icons/general/icon-save.svg";
import { ReactComponent as IconSaved } from "../../../../assets/icons/general/icon-save-filled.svg";
import { ReactComponent as IconLink } from "../../../../assets/icons/general/icon-link-small.svg";
import { ReactComponent as IconReply } from "../../../../assets/icons/content/icon-reply.svg";

function Buttons({ commentId, postId, subreadit }) {
  const { currentUser } = useAuth();
  const { saved, handleSave } = useSave();
  const { openSignUp } = useEntry();
  const copyRef = useRef();

  // Copy the post link
  const copyLink = () => {
    if (!copyRef) return;
    copyRef.current.select();
    copyRef.current.setSelectionRange(0, 99999);
    document.execCommand("copy");
  };

  return (
    <>
      <Container>
        <Button as={Link} to={`/b/${subreadit}/${postId}/${commentId}`}>
          <IconReply />
          View
        </Button>

        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            currentUser
              ? handleSave(currentUser.uid, commentId, "comment")
              : openSignUp();
          }}
        >
          {saved.includes(commentId) ? <IconSaved /> : <IconSave />}
          Save
        </Button>

        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            copyLink();
          }}
        >
          <IconLink />
          Share
        </Button>
      </Container>

      <Copy
        type="text"
        value={`${BREADIT_URL}/b/${subreadit}/${postId}/${commentId}`}
        ref={copyRef}
        readOnly
      />
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
  color: ${(props) => props.theme.secondary};
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
  color: ${(props) => props.theme.secondary};

  & > *:first-child {
    margin-right: 0.15rem;
  }

  & > a {
    height: 100%;
  }

  &:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }
`;

const Copy = styled.input`
  position: absolute;
  top: -9999px;
  left: -9999px;
  height: 0;
`;
