import React from "react";
import styled from "styled-components";
import { useTheme } from "../../../contexts/ThemeContext";

function ThemeSwitch() {
  const { theme, changeTheme } = useTheme();

  return (
    <Choice type="button" onClick={changeTheme}>
      <div>{theme === "light" ? "Dark" : "Light"}
        {' '}
        Mode
      </div>
    </Choice>
  );
}

export default ThemeSwitch;

const Choice = styled.button`
  display: flex;
  align-items: center;
  padding: 0.25rem 0 0.25rem 4.25rem;
  color: ${(props) => props.theme.text_primary};

  & > img {
    margin-right: 1rem;
  }

  &:hover {
    background: ${(props) => props.theme.vote_bg};
  }
`;
