import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useSave } from "../../../contexts/SaveContext";
import useComment from "../../../hooks/useComment";
import useWindowSize from "../../../hooks/useWindowSize";
import useDropdown from "../../../hooks/useDropdown";
import { BREADIT_URL } from "../../../utils/const";

// Icons
import { ReactComponent as IconComment } from "../../../assets/icons/general/icon-comment.svg";
import { ReactComponent as IconSave } from "../../../assets/icons/general/icon-save.svg";
import { ReactComponent as IconSaved } from "../../../assets/icons/general/icon-save-filled.svg";
import { ReactComponent as IconHide } from "../../../assets/icons/general/icon-hide.svg";
import { ReactComponent as IconLink } from "../../../assets/icons/general/icon-link-small.svg";
import { ReactComponent as IconDots } from "../../../assets/icons/content/icon-dots.svg";

function Buttons({ postId, subreadit, hide, user }) {
  const [commentsNumber, setCommentsNumber] = useState(0);
  const { saved, handleSave } = useSave();
  const { getCommentsNumber } = useComment();
  const { windowSize } = useWindowSize();
  const copyRef = useRef();
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen } = useDropdown(dropdownRef);

  useEffect(() => {
    (async () => {
      const comments = await getCommentsNumber(postId);
      setCommentsNumber(comments);
    })();
  }, []);

  // Copy the post link
  const copyLink = () => {
    if (!copyRef) return;
    copyRef.current.select();
    copyRef.current.setSelectionRange(0, 99999);
    document.execCommand("copy");
  };

  return (
    <Container>
      <Button as={Link} to={`/b/${subreadit}/${postId}`}>
        <IconComment />
        {commentsNumber}
        {" "}Comment
        {commentsNumber !== 1 && "s"}
      </Button>

      {windowSize.width > 576 ? (
        <>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleSave(user.uid, postId, "post");
            }}
          >
            {saved.includes(postId) ? <IconSaved /> : <IconSave />}
            Save
          </Button>

          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              copyLink();
            }}
          >
            <IconLink />
            Share
            <Copy
              type="text"
              value={`${BREADIT_URL}/b/${subreadit}/${postId}`}
              ref={copyRef}
              readOnly
            />
          </Button>

          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              hide(true);
            }}
          >
            <IconHide />
            Hide
          </Button>
        </>
      ) : (
        <Dropdown ref={dropdownRef}>
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
                onClick={(e) => {
                  e.preventDefault();
                  handleSave(user.uid, postId, "post");
                }}
              >
                {saved.includes(postId) ? <IconSaved /> : <IconSave />}
                Save
              </Choice>

              <Choice
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  copyLink();
                }}
              >
                <IconLink />
                Share
                <Copy
                  type="text"
                  value={`${BREADIT_URL}/b/${subreadit}/${postId}`}
                  ref={copyRef}
                  readOnly
                />
              </Choice>

              <Choice
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  hide(true);
                }}
              >
                <IconHide />
                Hide
              </Choice>
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
  user: PropTypes.shape({
    uid: PropTypes.string,
  }),
};

Buttons.defaultProps = {
  hide: () => {},
  user: null,
};

const Container = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.secondary};
  display: flex;
  align-items: stretch;

  & > * {
    display: flex;
    align-items: center;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  & > *:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }

  & > *:first-child {
    padding-left: 0;
  }

  & > *:last-child {
    padding-right: 0;
  }
`;

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

const Copy = styled.input`
  position: absolute;
  top: -9999px;
`;

const Dropdown = styled.div`
  position: relative;
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
  top: 1.5rem;
  right: 0;
  padding: 0;
  z-index: 5;
`;

const Choice = styled.button`
  display: flex;
  padding: 0.25rem 0.5rem;
  width: 100%;
  color: ${(props) => props.theme.secondary};
  font-weight: 500;

  & > svg {
    margin-right: 0.5rem;
  }

  &:hover {
    background: ${(props) => props.theme.backgroundTertiary};
  }
`;
