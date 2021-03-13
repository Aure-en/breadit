import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSubscription } from "../../contexts/SubscriptionContext";
import useSubreadit from "../../hooks/useSubreadit";
import JoinButton from "../subreadit/JoinButton";

function TopSubreadits() {
  const [subreadits, setSubreadits] = useState([]);
  const { getPopularSubreadits } = useSubreadit();
  const { subscriptions } = useSubscription();
  const { currentUser } = useAuth();

  useEffect(() => {
    (async () => {
      const subreadits = await getPopularSubreadits(5);
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
                    <Name to={`/b/${subreadit.name}`}>
                      b/
                      {subreadit.name}
                    </Name>
                    <Small>
                      {subreadit.members} member
                      {subreadit.members !== 1 && "s"}
                    </Small>
                  </div>
                  <JoinButton
                    subscriptions={subscriptions}
                    subreadit={subreadit}
                    user={currentUser}
                  />
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

const Container = styled.div`
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.bg_container};
  box-shadow: 0 0 10px -5px ${(props) => props.theme.shadow};
  line-height: 1.25rem;
  border-radius: 0.25rem;
`;

const Heading = styled.h3`
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const SubreaditsList = styled.ul`
  padding: 0 0.5rem;

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
  font-size: 0.75rem;
  color: ${(props) => props.theme.text_secondary};
`;