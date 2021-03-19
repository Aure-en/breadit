import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEntry } from "../../../../contexts/EntryContext";
import { useSave } from "../../../../contexts/SaveContext";
import { toastify } from "../../../shared/Toast";

// Icons
import { ReactComponent as IconSave } from "../../../../assets/icons/general/icon-save.svg";
import { ReactComponent as IconSaved } from "../../../../assets/icons/general/icon-save-filled.svg";

function SaveButton({ docId, type }) {
  const { currentUser } = useAuth();
  const { openSignUp } = useEntry();
  const { saved, handleSave } = useSave();

  return (
    <Button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        if (currentUser) {
          saved.includes(docId)
            ? saved.type === "post"
              ? toastify("Post successfully unsaved")
              : toastify("Comment successfully unsaved")
            : saved.type === "post"
            ? toastify("Post successfully saved")
            : toastify("Comment successfully saved");
          handleSave(currentUser.uid, docId, type);
        } else {
          openSignUp();
        }
      }}
    >
      {saved.includes(docId) ? <IconSaved /> : <IconSave />}
      Save
    </Button>
  );
}

export default SaveButton;

SaveButton.propTypes = {
  docId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["post", "comment"]).isRequired,
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
