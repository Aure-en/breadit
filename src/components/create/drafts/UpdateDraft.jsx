import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthContext";
import useDraft from "../../../hooks/useDraft";

function UpdateDraft({ draftId, subreadit, title, type, post, link }) {
  const [button, setButton] = useState("Update Draft");
  const [draft, setDraft] = useState({});
  const { currentUser } = useAuth();
  const { draftListener, editDraft } = useDraft();

  useEffect(() => {
    const unsubscribe = draftListener(draftId, (doc) => {
      setDraft(doc.data());
    });
    return unsubscribe;
  }, [draftId]);

  useEffect(() => {
    if (button === "Draft Updated") setButton("Update Draft");
  }, [button]);

  const checkChanges = (draft, subreadit, title, type, post, link) => {
    if (Object.keys(draft).length === 0) return;
    if (
      draft.subreadit.id === subreadit.id &&
      draft.title === title &&
      draft.type === type &&
      (draft.content === post || draft.content === link)
    ) {
      return false;
    }
    return true;
  };

  const onUpdateDraft = async () => {
    if (currentUser.uid !== draft.author.id) return;
    if (!checkChanges(draft, subreadit, title, type, post, link)) return;
    await editDraft(
      draftId,
      subreadit,
      title,
      type,
      type === "post" ? post : link
    );
    setButton("Draft Updated");
  };

  return (
    <>
      {draft && (
        <>
          <Button
            type="button"
            onClick={onUpdateDraft}
            disabled={
              (!post && !title && !subreadit.id && !link) ||
              !checkChanges(draft, subreadit, title, type, post, link)
            }
          >
            {button}
          </Button>
        </>
      )}
    </>
  );
}

export default UpdateDraft;

UpdateDraft.propTypes = {
  subreadit: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  title: PropTypes.string,
  type: PropTypes.string,
  post: PropTypes.string,
  link: PropTypes.string,
  draftId: PropTypes.string.isRequired,
};

UpdateDraft.defaultProps = {
  subreadit: PropTypes.shape({
    id: "",
    name: "",
  }),
  title: "",
  type: "post",
  post: "",
  link: "",
};

const Button = styled.button`
  display: block;
  border: 1px solid ${(props) => props.theme.accent_secondary};
  color: ${(props) => props.theme.accent_secondary};
  border-radius: 5rem;
  padding: 0.35rem 1.25rem;
  font-weight: 500;
  text-align: center;

  &:hover {
    color: ${(props) => props.theme.accent_secondary_active};
    border: 1px solid ${(props) => props.theme.accent_secondary_active};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${(props) => props.theme.accent_secondary_disabled};
    border: 1px solid ${(props) => props.theme.accent_secondary_disabled};
  }
`;
