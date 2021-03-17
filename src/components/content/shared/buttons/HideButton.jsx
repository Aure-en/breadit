import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { toastify } from "../../../shared/Toast";

import { ReactComponent as IconHide } from "../../../../assets/icons/general/icon-hide.svg";

function HideButton({ setHide }) {
  return (
    <Button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        setHide(true);
        toastify(<UnhideButton setHide={setHide} />);
      }}
    >
      <IconHide />
      Hide
    </Button>
  );
}

const UnhideButton = ({ setHide }) => (
  <Container>
    Post successfully hidden
    <Undo type="button" onClick={() => setHide(false)}>
      Undo
    </Undo>
  </Container>
);

export default HideButton;

HideButton.propTypes = {
  setHide: PropTypes.func.isRequired,
};

UnhideButton.propTypes = {
  setHide: PropTypes.func.isRequired,
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

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Undo = styled.button`
  color: ${(props) => props.theme.accent};

  &:hover {
    color: ${(props) => props.theme.accent_hover};
  }
`;
