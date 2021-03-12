import React, { useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useDropdown from "../../../hooks/useDropdown";
import useWindowSize from "../../../hooks/useWindowSize";
import DeleteButton from "./buttons/DeleteButton";
import ShareButton from "./buttons/ShareButton";
import EditButton from "./buttons/EditButton";

// Icons
import { ReactComponent as IconDots } from "../../../assets/icons/content/icon-dots.svg";

function Buttons({ canEdit, canDelete, onEdit, onDelete, copy, type }) {
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen } = useDropdown(dropdownRef);
  const { windowSize } = useWindowSize();

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
              <ShareButton
                copy={copy}
                onClick={() => setIsDropdownOpen(false)}
              />
              {canEdit && <EditButton onEdit={onEdit} />}
              {canDelete && (
                <DeleteButton
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
          <ShareButton copy={copy} onClick={() => setIsDropdownOpen(false)} />
          {canEdit && <EditButton onEdit={onEdit} />}
          {canDelete && <DeleteButton onDelete={onDelete} type={type} />}
        </Container>
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

  & > * {
    display: flex;
    padding: 0.25rem 0.5rem;
    width: 100%;
  }

  & > *:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }
`;
