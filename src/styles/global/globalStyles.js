import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    box-sizing: border-box;
    font-family: 'IBM Plex Sans', 'Noto Sans JP', 'IBM Plex Mono', sans-serif;
    font-size: .875rem;
    background: ${({ theme }) => theme.backgroundPrimary};
    color: ${({ theme }) => theme.primary};
    line-height: 1.25rem;
  }

  a {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: 'IBM Plex Sans', 'Noto Sans JP', 'IBM Plex Mono', sans-serif;

    &:focus {
      outline: none;
    }
  }

  li {
    margin: .5rem 0;
  }

  h3 {
    margin: .25rem 0;
    font-weight: 500;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    box-sizing: border-box;
  }

`;

export default GlobalStyles;
