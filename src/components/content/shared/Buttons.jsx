import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useAuth } from "../../../contexts/AuthContext";
import useDropdown from "../../../hooks/useDropdown";
import useSubreadit from "../../../hooks/useSubreadit";
import useWindowSize from "../../../hooks/useWindowSize";
import DeleteButton from "./buttons/DeleteButton";
import ShareButton from "./buttons/ShareButton";
import EditButton from "./buttons/EditButton";

// Icons
import { ReactComponent as IconDots } from "../../../assets/icons/content/icon-dots.svg";

function Buttons({ authorId, subreaditName, onEdit, onDelete, copy, type }) {
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen } = useDropdown(dropdownRef);
  const { windowSize } = useWindowSize();
  const { currentUser } = useAuth();
  const { getDeletePermissions } = useSubreadit();
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  // Sees if the user has permission to edit / delete the post
  useEffect(() => {
    // Only the author can edit.
    if (currentUser && currentUser.uid === authorId) setCanEdit(true);

    // The author or subreadit mods can delete.
    (async () => {
      const permissions = await getDeletePermissions(subreaditName);
      if (
        (currentUser && currentUser.uid === authorId) ||
        (currentUser && permissions[currentUser.uid])
      )
        setCanDelete(true);
    })();
  }, []);

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
              {canEdit && onEdit && <EditButton onEdit={onEdit} />}
              {canDelete && onDelete && (
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
  authorId: PropTypes.string.isRequired,
  subreaditName: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  copy: PropTypes.string.isRequired,
  type: PropTypes.string,
};

Buttons.defaultProps = {
  subreaditName: "",
  onEdit: null,
  onDelete: null,
  type: "post",
};

const Container = styled.div`
  display: flex;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.text_secondary};
  padding: 0.5rem 0;
  position: relative;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  & > button:hover {
    background: ${(props) => props.theme.vote_bg};
  }

  @media all and (min-width: 768px) {
    padding: 0.5rem 0;
  }
`;

const DropdownHeader = styled.button`
  color: ${(props) => props.theme.text_secondary};
`;

const DropdownList = styled.div`
  position: absolute;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.text_secondary};
  background: ${(props) => props.theme.bg_container};
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
    background: ${(props) => props.theme.vote_bg};
  }
`;
