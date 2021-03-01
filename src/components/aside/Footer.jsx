import React from "react";
import styled from "styled-components";

function Footer() {
  return (
    <Container>
      <div>
        <Link href="/">Help</Link>
        <Link href="/">Reddit App</Link>
        <Link href="/">Reddit Coins</Link>
        <Link href="/">Reddit Premium</Link>
        <Link href="/">Reddit Gifts</Link>
        <Link href="/">Communities</Link>
        <Link href="/">Rereddit</Link>
        <Link href="/">Topics</Link>
      </div>

      <div>
        <Link href="/">About</Link>
        <Link href="/">Careers</Link>
        <Link href="/">Press</Link>
        <Link href="/">Advertise</Link>
        <Link href="/">Blog</Link>
        <Link href="/">Terms</Link>
        <Link href="/">Content Policy</Link>
        <Link href="/">Privacy Policy</Link>
        <Link href="/">Mod Policy</Link>
      </div>
    </Container>
  );
}

export default Footer;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  line-height: 1.25rem;
  padding: 1rem;
  background: ${(props) => props.theme.backgroundSecondary};
  border-radius: 5px;
  font-size: 0.825rem;
`;

const Link = styled.a`
  display: block;
  &:hover {
    text-decoration: underline;
  }
`;
