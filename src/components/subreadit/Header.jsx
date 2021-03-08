import React, { useState, useEffect } from 'react'
import PropTypes from "prop-types";
import styled from "styled-components";
import useSubreadit from "../../hooks/useSubreadit";

function Header({ subreaditId }) {
  const [subreadit, setSubreadit] = useState();
  const { getSubreaditById } = useSubreadit();

  useEffect(() => {
    if (!subreaditId) return;
    (async () => {
      const subreadit = await getSubreaditById(subreaditId);
      setSubreadit(subreadit.data());
    })();
  }, [subreaditId]);

  return (
    <>
      {subreadit && (
        <Container>
          <Banner src={subreadit.banner} alt={`${subreadit.name}'s banner`} />
          <Icon src={subreadit.icon} alt={`${subreadit.name}'s icon`} />
          <Heading>{subreadit.name_sensitive}</Heading>
          <Subheading>b/{subreadit.name}</Subheading>
          <Button type="button"></Button>
        </Container>
      )}
    </>
  )
}

export default Header;

Header.propTypes = {
  subreaditId: PropTypes.string.isRequired,
};

const Container = styled.div``;

const Banner = styled.div``;

const Icon = styled.div``;

const Button = styled.button``;