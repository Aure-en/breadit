import React from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Toast() {
  return (
    <StyledToastContainer
      position="bottom-center"
      autoClose={5000}
      draggable
      pauseOnHover
    />
  );
}

export const toastify = (content) => {
  return toast(content, {
    position: "bottom-center",
    autoClose: 5000,
    draggable: true,
    pauseOnHover: true,
  });
};

export default Toast;

const StyledToastContainer = styled(ToastContainer).attrs({
  toastClassName: "toast-wrapper",
  progressClassName: "progress",
  bodyClassName: "body",
})`
  .toast-wrapper {
    background: ${(props) => props.theme.bg_container};
  }

  .body {
    width: 100%;
  }

  .progress {
    background: ${(props) => props.theme.toast_progress};
  }

  button[aria-label="close"] {
    color: ${(props) => props.theme.text_primary};
  }
`;
