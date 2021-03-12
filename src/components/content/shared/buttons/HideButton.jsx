import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { ReactComponent as IconHide } from "../../../../assets/icons/general/icon-hide.svg";

function HideButton({ onHide }) {
  return (
    <Button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onHide();
      }}
    >
      <IconHide />
      Hide
    </Button>
  );
}

export default HideButton;

HideButton.propTypes = {
  onHide: PropTypes.func.isRequired,
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
