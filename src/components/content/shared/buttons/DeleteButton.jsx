import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Delete from "../Delete";

// Icon
import { ReactComponent as IconDelete } from "../../../../assets/icons/content/icon-delete.svg";

function DeleteButton({ onDelete, type }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setIsDeleteModalOpen(true)}>
        <IconDelete />
        Delete
      </Button>
      {isDeleteModalOpen && (
        <Delete
          closeModal={() => setIsDeleteModalOpen(false)}
          type={type}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

export default DeleteButton;

DeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
  type: PropTypes.string,
};

DeleteButton.defaultProps = {
  type: "document",
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
