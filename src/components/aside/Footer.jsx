import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <Container>
      <Heading>Thank you for visiting</Heading>
      <p>
        Please feel free to explore, create communities, posts, and comments if
        you'd like.
      </p>

      <p>
        More about Breadit
        <ul>
          <Li>
            <Link to="/b/breadit/FAsPoHGkEOLEBXEbDzQW">Introduction post</Link>
          </Li>
          <Li>
            <a href="https://github.com/Aure-en/breadit">Repository</a>
          </Li>
        </ul>
      </p>
    </Container>
  );
}

export default Footer;

const Container = styled.div`
  display: grid;
  padding: 1rem 1rem 0 1rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.bg_container};
  box-shadow: 0 0 10px -5px ${(props) => props.theme.shadow};
  border-radius: 0.25rem;
`;

const Heading = styled.div`
  font-weight: 300;
  font-size: 1.125rem;
  margin: 0.25rem 0;
  text-align: center;
`;

const Li = styled.li`
  &:hover {
    text-decoration: underline;
  }
`;