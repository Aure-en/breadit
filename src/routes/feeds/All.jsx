import React, { useState } from "react";
import styled from "styled-components";
import useWindowSize from "../../hooks/useWindowSize";
import AllPosts from "../../components/feed/All";
import TopSubreadits from "../../components/aside/Top";
import Create from "../../components/aside/Create";
import Latest from "../../components/aside/Latest";
import Footer from "../../components/aside/Footer";
import Sort from "../../components/sort/Sort";

function All() {
  const [sort, setSort] = useState("top");
  const { windowSize } = useWindowSize();

  return (
    <>
      <Container>
        <Sort setSort={setSort} sort={sort} />
        <AllPosts sort={sort} />
      </Container>
      {windowSize.width > 992 && (
        <Aside>
          <TopSubreadits />
          <Create />
          <Latest />
          <Footer />
        </Aside>
      )}
    </>
  );
}

export default All;

const Container = styled.div`
  max-width: 40rem;
  flex: 1;
  margin: 1rem 0;

  @media all and (min-width: 992px) {
    margin: 3rem 0;
  }
`;

const Aside = styled.aside`
  margin: 3rem 0 3rem 3rem;
  max-width: 20rem;

  & > * {
    margin-bottom: 1.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
