import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Container>
      <h4>Sorry, there is nothing here.</h4>
      <div>The link might have been incorrect.</div>
      <Button to="/">Home</Button>
    </Container>
  );
}

export default NotFound;

const Container = styled.div`
  margin-top: 0.5rem;
  width: 100vw;
  max-width: 25rem;
  background: ${(props) => props.theme.bg_container};
  border-bottom: 1px solid ${(props) => props.theme.border};
  border-top: 1px solid ${(props) => props.theme.border};
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  padding: 2rem 1rem;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media all and (min-width: 768px) {
    border: 1px solid ${(props) => props.theme.border};
    align-items: center;
    align-self: center;
  }
`;

const Button = styled(Link)`
  display: block;
  color: ${(props) => props.theme.bg_container};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 0.25rem;
  padding: 0.35rem 1.25rem;
  font-weight: 500;
  text-align: center;
  margin-top: 1rem;

  &:hover {
    color: ${(props) => props.theme.bg_container};
    background-color: ${(props) => props.theme.accent_active};
    border: 1px solid ${(props) => props.theme.accent_active};
  }
`;
