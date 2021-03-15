import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthContext";
import useDraft from "../../../hooks/useDraft";

function SaveDraft({ subreadit, title, type, post, link, setDraft }) {
  const [button, setButton] = useState("Save Draft");
  const { currentUser } = useAuth();
  const { createDraft } = useDraft();

  useEffect(() => {
    if (button === "Draft Saved") setButton("Update Draft");
  }, [button]);

  const onSaveDraft = async () => {
    if (!post && !title && !subreadit.id && !link) return;
    const draftId = await createDraft(
      currentUser,
      subreadit,
      title,
      type,
      type === "post" ? post : link
    );
    setDraft(draftId);
    setButton("Draft Saved");
  };

  return (
    <Button
      type="button"
      onClick={onSaveDraft}
      disabled={!post && !title && !subreadit.id && !link}
    >
      {button}
    </Button>
  );
}

export default SaveDraft;

SaveDraft.propTypes = {
  subreadit: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  title: PropTypes.string,
  type: PropTypes.string,
  post: PropTypes.string,
  link: PropTypes.string,
  setDraft: PropTypes.func.isRequired,
};

SaveDraft.defaultProps = {
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
