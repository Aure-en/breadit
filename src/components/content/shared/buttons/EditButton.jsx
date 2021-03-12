import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { ReactComponent as IconEdit } from "../../../../assets/icons/content/icon-edit.svg";

function EditButton({ onEdit }) {
  return (
    <Button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onEdit();
      }}
    >
      <IconEdit />
      Edit
    </Button>
  );
}

export default EditButton;

EditButton.propTypes = {
  onEdit: PropTypes.func.isRequired,
};

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
