import React, { useState, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useDropdown from "../../../hooks/useDropdown";
import useWindowSize from "../../../hooks/useWindowSize";
import Delete from "./Delete";
import { BREADIT_URL } from "../../../utils/const";

// Icons
import { ReactComponent as IconDots } from "../../../assets/icons/content/icon-dots.svg";
import { ReactComponent as IconEdit } from "../../../assets/icons/content/icon-edit.svg";
import { ReactComponent as IconDelete } from "../../../assets/icons/content/icon-delete.svg";
import { ReactComponent as IconLink } from "../../../assets/icons/general/icon-link-small.svg";

function Buttons({ canEdit, canDelete, onEdit, onDelete, copy, type }) {
  const dropdownRef = useRef();
  const copyRef = useRef();
  const { windowSize } = useWindowSize();
  const { isDropdownOpen, setIsDropdownOpen } = useDropdown(dropdownRef);

  // Copy the post link
  const copyLink = () => {
    if (!copyRef) return;
    copyRef.current.select();
    copyRef.current.setSelectionRange(0, 99999);
    document.execCommand("copy");
  };

  return (
    <>
      {windowSize.width <= 768 && (
        <Container ref={dropdownRef}>
          <DropdownHeader
            isDropdownOpen={isDropdownOpen}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <IconDots />
          </DropdownHeader>
          {isDropdownOpen && (
            <DropdownList>
              <Choice
                type="button"
                onClick={() => {
                  copyLink();
                  setIsDropdownOpen(false);
                }}
              >
                <IconLink />
                Share
              </Choice>
              {canEdit && (
                <Choice type="button" onClick={onEdit}>
                  <IconEdit />
                  Edit
                </Choice>
              )}
              {canDelete && (
                <DeleteChoice
                  onClick={() => setIsDropdownOpen(false)}
                  onDelete={onDelete}
                  type={type}
                />
              )}
            </DropdownList>
          )}
        </Container>
      )}

      {windowSize.width > 768 && (
        <Container>
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

          {canEdit && (
            <Button type="button" onClick={onEdit}>
              <IconEdit />
              Edit
            </Button>
          )}
          {canDelete && <DeleteButton onDelete={onDelete} type={type} />}
        </Container>
      )}

      <Copy
        type="text"
        value={`${BREADIT_URL}/b/${copy}`}
        ref={copyRef}
        readOnly
      />
    </>
  );
}

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

function DeleteChoice({ onDelete, type }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <Choice
        type="button"
        onClick={() => {
          setIsDeleteModalOpen(true);
        }}
      >
        <IconDelete />
        Delete
      </Choice>
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

export default Buttons;

Buttons.propTypes = {
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  copy: PropTypes.string.isRequired,
  type: PropTypes.string,
};

Buttons.defaultProps = {
  canEdit: false,
  canDelete: false,
  onEdit: () => {},
  onDelete: () => {},
  type: "post",
};

DeleteChoice.propTypes = {
  onDelete: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

DeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

const Container = styled.div`
  display: flex;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.secondary};
  padding: 0.5rem 0;
  position: relative;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  & > button:hover {
    background: ${(props) => props.theme.backgroundTertiary};
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
`;

const DropdownHeader = styled.button`
  color: ${(props) => props.theme.secondary};
`;

const DropdownList = styled.div`
  position: absolute;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.secondary};
  background: ${(props) => props.theme.backgroundSecondary};
  top: 2.15rem;
  right: 0;
  padding: 0;
  z-index: 5;
`;

const Choice = styled.button`
  display: flex;
  padding: 0.25rem 0.5rem;
  width: 100%;
  color: ${(props) => props.theme.secondary};

  &:hover {
    background: ${(props) => props.theme.accentBackground};
  }
`;

const Copy = styled.input`
  position: absolute;
  top: -9999px;
  left: -9999px;
  height: 0;
`;
