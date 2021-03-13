import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

// Icons
import { ReactComponent as IconCommunity } from "../../assets/icons/header/icon-community.svg";

function None() {
  return (
    <Container>
      <Icon>
        <IconCommunity />
      </Icon>
      <h4>Breadit gets better when you join communities.</h4>
      Find some that you'll love by exploring more!
      <StyledLink to="/b/all">Browse Popular Posts</StyledLink>
    </Container>
  );
}

export default None;

const Container = styled.div`
  margin-top: 0.5rem;
  width: 100vw;
  max-width: 100%;
  background: ${(props) => props.theme.bg_container};
  border-bottom: 1px solid ${(props) => props.theme.border};
  border-top: 1px solid ${(props) => props.theme.border};
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  padding: 1rem;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media all and (min-width: 768px) {
    border: 1px solid ${(props) => props.theme.border};
    align-items: center;
    max-width: 40rem;
  }
`;

const Icon = styled.div`
  color: ${(props) => props.theme.accent};
`;

const StyledLink = styled(Link)`
  display: block;
  color: ${(props) => props.theme.bg_container};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 5rem;
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
