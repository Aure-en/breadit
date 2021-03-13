import React from "react";
import styled from "styled-components";
import { useTheme } from "../../../contexts/ThemeContext";

// Icons
import { ReactComponent as IconLight } from "../../../assets/icons/header/icon-light.svg";

function ThemeSwitch() {
  const { theme, changeTheme } = useTheme();

  return (
    <Choice type="button" onClick={changeTheme}>
      <IconLight />
      <div>{theme === "light" ? "Dark" : "Light"}
        {' '}
        Mode
      </div>
    </Choice>
  );
}

export default ThemeSwitch;

const Choice = styled.button`
  display: grid;
  grid-template-columns: 2rem 1fr;
  grid-gap: 0.75rem;
  align-items: center;
  padding: 0.25rem 1rem;
  justify-items: start;
  color: ${(props) => props.theme.text_primary};

  & > svg:first-child {
    color: ${(props) => props.theme.text_secondary};
  }

  &:hover {
    background: ${(props) => props.theme.header_bg_secondary};
  }
`;
