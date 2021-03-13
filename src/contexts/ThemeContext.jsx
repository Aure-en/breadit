import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { ThemeProvider as ValueProvider } from "styled-components";
import light from "../styles/themes/light";
import dark from "../styles/themes/dark";

const ThemeContext = React.createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const current = localStorage.getItem("theme");
  const [theme, setTheme] = useState(current || "light");

  const changeTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  };

  const value = {
    theme,
    changeTheme,
  };

  ThemeProvider.propTypes = {
    children: PropTypes.node,
  };

  ThemeProvider.defaultProps = {
    children: <div />,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ValueProvider theme={value.theme === "light" ? light : dark}>
        {children}
      </ValueProvider>
    </ThemeContext.Provider>
  );
}
