import React from "react";
import styled from "styled-components";

function Rules() {
  return (
    <Container>
      <Heading>Breadit Rules</Heading>
      <RulesList>
        <li>Remember the human</li>
        <li>Behave like you would in real life</li>
        <li>Look for the original source of content</li>
        <li>Search for duplicates before posting</li>
        <li>Read the community’s rules</li>
      </RulesList>
    </Container>
  );
}

export default Rules;

const Container = styled.div`
  padding: 1rem;
  background: ${(props) => props.theme.bg_container};
  border-radius: 5px;
`;

const Heading = styled.h2`
  font-size: 1rem;
`;

const RulesList = styled.ol``;
