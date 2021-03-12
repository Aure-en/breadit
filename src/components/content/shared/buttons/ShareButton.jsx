import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { BREADIT_URL } from "../../../../utils/const";

// Icons
import { ReactComponent as IconLink } from "../../../../assets/icons/general/icon-link-small.svg";

function ShareButton({ copy }) {
  const copyRef = useRef();

  // Copy the post link
  const copyLink = () => {
    if (!copyRef) return;
    copyRef.current.select();
    copyRef.current.setSelectionRange(0, 99999);
    document.execCommand("copy");
  };

  return (
    <>
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

      <Copy
        type="text"
        value={`${BREADIT_URL}/b/${copy}`}
        ref={copyRef}
        readOnly
      />
    </>
  );
}

export default ShareButton;

ShareButton.propTypes = {
  copy: PropTypes.string.isRequired,
};

const Button = styled.button`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.secondary};

  & > *:first-child {
    margin-right: 0.15rem;
  }
`;

const Copy = styled.input`
  position: absolute;
  top: -9999px;
  left: -9999px;
  height: 0;
`;
