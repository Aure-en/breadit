import React, { useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useDropdown from "../../../hooks/useDropdown";
import useWindowSize from "../../../hooks/useWindowSize";

// Icons
import { ReactComponent as IconDots } from "../../../assets/icons/content/icon-dots.svg";
import { ReactComponent as IconEdit } from "../../../assets/icons/content/icon-edit.svg";
import { ReactComponent as IconDelete } from "../../../assets/icons/content/icon-delete.svg";

function ModifyButtons({ canEdit, onEditClick, onDeleteClick }) {
  const dropdownRef = useRef();
  const { windowSize } = useWindowSize();
  const { isDropdownOpen, setIsDropdownOpen } = useDropdown(dropdownRef);

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
              {canEdit && (
                <Choice type="button" onClick={onEditClick}>
                  <IconEdit />
                  Edit
                </Choice>
              )}
              <Choice type="button" onClick={onDeleteClick}>
                <IconDelete />
                Delete
              </Choice>
            </DropdownList>
          )}
        </Container>
      )}

      {windowSize.width > 768 && (
        <Container>
          {canEdit && (
            <Button type="button" onClick={onEditClick}>
              <IconEdit />
              Edit
            </Button>
          )}
          <Button type="button" onClick={onDeleteClick}>
            <IconDelete />
            Delete
          </Button>
        </Container>
      )}
    </>
  );
}

export default ModifyButtons;

ModifyButtons.propTypes = {
  canEdit: PropTypes.bool,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
};

ModifyButtons.defaultProps = {
  canEdit: false,
  onEditClick: () => {},
  onDeleteClick: () => {},
};

const Container = styled.div`
  position: relative;
  color: ${(props) => props.theme.secondary};
  display: flex;
  z-index: 5;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  & > button:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }
`;

const Button = styled.button`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.secondary};
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

  &:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }
`;
