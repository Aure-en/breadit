import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import useSubreadit from "../../hooks/useSubreadit";

const colors = {
  background: "white",
  secondary: "grey",
  accent: "red",
};

const Container = styled.div`
  padding: 1rem;
  background: ${colors.background};
  line-height: 1.25rem;
`;

const Heading = styled.h3`
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const SubreaditsList = styled.ul`
  & > li {
    margin-bottom: 1rem;
  }

  & > li:last-child {
    margin-bottom: 0;
  }
`;

const Subreadit = styled.li`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  grid-gap: 1rem;
`;

const Icon = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`;

const Name = styled(Link)`
  font-weight: 500;
  font-size: 0.825rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Small = styled.div`
  font-size: .75rem;
  color: ${colors.secondary};
`;

const Button = styled.button`
  border: 1px solid ${colors.accent};
  color: ${colors.accent};
  border-radius: 5rem;
  padding: 0.35rem 1.5rem;
  font-weight: 500;
`;

function TopSubreadits() {
  const [subreadits, setSubreadits] = useState([]);
  const { getPopularSubreadits } = useSubreadit();

  useEffect(() => {
    (async () => {
      const subreadits = await getPopularSubreadits();
      setSubreadits(subreadits);
    })();
  }, []);

  return (
    <>
      {subreadits.length !== 0 && (
        <Container>
          <Heading>Most popular communities</Heading>
          <SubreaditsList>
            {subreadits.map((subreadit) => {
              return (
                <Subreadit key={subreadit.id}>
                  <Icon src={subreadit.icon} alt={`${subreadit.name}'s Icon`} />
                  <div>
                    <Name to={`/b/${subreadit.name}`}>b/{subreadit.name}</Name>
                    <Small>{subreadit.members} member{subreadit.members !== 1 && "s"}</Small>
                  </div>
                  <Button type="button">Join</Button>
                </Subreadit>
              );
            })}
          </SubreaditsList>
        </Container>
      )}
    </>
  );
}

export default TopSubreadits;
