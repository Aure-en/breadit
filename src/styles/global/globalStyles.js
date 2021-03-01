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

    &:focus {
      outline: none;
    }
  }

  li {
    margin: .5rem 0;
  }
`;

export default GlobalStyles;
