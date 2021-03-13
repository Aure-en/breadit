import React, { useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useWindowSize from "../../../../hooks/useWindowSize";
import useDropdown from "../../../../hooks/useDropdown";
import CommentButton from "../../../content/shared/buttons/CommentButton";
import ShareButton from "../../../content/shared/buttons/ShareButton";
import SaveButton from "../../../content/shared/buttons/SaveButton";
import HideButton from "../../../content/shared/buttons/HideButton";

// Icons
import { ReactComponent as IconDots } from "../../../../assets/icons/content/icon-dots.svg";

function Buttons({ postId, subreadit, hide }) {
  const { windowSize } = useWindowSize();
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen } = useDropdown(dropdownRef);

  return (
    <Container>
      <CommentButton subreadit={subreadit} postId={postId} />

      {windowSize.width > 576 ? (
        <>
          <SaveButton docId={postId} type="post" />
          <ShareButton copy={`${subreadit}/${postId}`} />
          <HideButton onHide={() => hide(true)} />
        </>
      ) : (
        <Dropdown ref={dropdownRef}>
          <DropdownHeader
            isDropdownOpen={isDropdownOpen}
            onClick={(e) => {
              e.preventDefault();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <IconDots />
          </DropdownHeader>

          {isDropdownOpen && (
            <DropdownList>
              <SaveButton
                docId={postId}
                type="post"
                onClick={() => setIsDropdownOpen(false)}
              />
              <ShareButton
                copy={`${subreadit}/${postId}`}
                onClick={() => setIsDropdownOpen(false)}
              />
              <HideButton
                onHide={() => hide(true)}
                onClick={() => setIsDropdownOpen(false)}
              />
            </DropdownList>
          )}
        </Dropdown>
      )}
    </Container>
  );
}

export default Buttons;

Buttons.propTypes = {
  postId: PropTypes.string.isRequired,
  subreadit: PropTypes.string.isRequired,
  hide: PropTypes.func,
};

Buttons.defaultProps = {
  hide: () => {},
};

const Container = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.text_secondary};
  display: flex;
  align-items: stretch;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  & > *:hover {
    background: ${(props) => props.theme.vote_bg};
  }
`;

const Dropdown = styled.div`
  position: relative;
`;

const DropdownHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.text_secondary};
`;

const DropdownList = styled.div`
  position: absolute;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.text_secondary};
  background: ${(props) => props.theme.bg_container};
  top: 1.5rem;
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
