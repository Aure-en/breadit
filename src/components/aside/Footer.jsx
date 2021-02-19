import React from "react";
import styled from "styled-components";

function Footer() {
  return (
    <Container>
      <ul>
        <li>
          <Link href="/">Help</Link>
        </li>
        <li>
          <Link href="/">Reddit App</Link>
        </li>
        <li>
          <Link href="/">Reddit Coins</Link>
        </li>
        <li>
          <Link href="/">Reddit Premium</Link>
        </li>
        <li>
          <Link href="/">Reddit Gifts</Link>
        </li>
        <li>
          <Link href="/">Communities</Link>
        </li>
        <li>
          <Link href="/">Rereddit</Link>
        </li>
        <li>
          <Link href="/">Topics</Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link href="/">About</Link>
        </li>
        <li>
          <Link href="/">Careers</Link>
        </li>
        <li>
          <Link href="/">Press</Link>
        </li>
        <li>
          <Link href="/">Advertise</Link>
        </li>
        <li>
          <Link href="/">Blog</Link>
        </li>
        <li>
          <Link href="/">Terms</Link>
        </li>
        <li>
          <Link href="/">Content Policy</Link>
        </li>
        <li>
          <Link href="/">Privacy Policy</Link>
        </li>
        <li>
          <Link href="/">Mod Policy</Link>
        </li>
      </ul>
    </Container>
  );
}

export default Footer;

const colors = {
  background: "white",
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  line-height: 1.25rem;
  padding: 1rem;
  background: ${colors.background};
  border-radius: 5px;
  font-size: 0.825rem;
`;

const Link = styled.a`
  &:hover {
    text-decoration: underline;
  }
`;
