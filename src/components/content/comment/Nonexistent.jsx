import React from "react";
import styled from "styled-components";

// Icons
import { ReactComponent as IconComment } from "../../../assets/icons/general/icon-comment.svg";

function Nonexistant() {
  return (
    <Container>
      <Icon>
        <IconComment />
      </Icon>
      <h4>Sorry, we couldn't find the comment you are looking for.</h4>
      <div>The comment may have been deleted or the link is incorrect.</div>
    </Container>
  );
}

export default Nonexistant;

const Container = styled.div`
  margin-top: 0.5rem;
  background: ${(props) => props.theme.bg_container};
  padding: 1rem;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Icon = styled.span`
  color: ${(props) => props.theme.accent};
`;
