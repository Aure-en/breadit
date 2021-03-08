import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEntry } from "../../contexts/EntryContext";
import { useSubscription } from "../../contexts/SubscriptionContext";
import useSubreadit from "../../hooks/useSubreadit";

function TopSubreadits() {
  const [subreadits, setSubreadits] = useState([]);
  const [isHovered, setIsHovered] = useState();
  const {
    getPopularSubreadits,
    joinSubreadit,
    leaveSubreadit,
  } = useSubreadit();
  const { subscriptions } = useSubscription();
  const { currentUser } = useAuth();
  const { openSignUp } = useEntry();

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
                  {!subscriptions.includes(subreadit.id) ? (
                    <ButtonFilled
                      type="button"
                      onClick={() =>
                        currentUser
                          ? joinSubreadit(currentUser.uid, subreadit)
                          : openSignUp()
                      }
                    >
                      Join
                    </ButtonFilled>
                  ) : (
                    <Button
                      type="button"
                      onMouseEnter={() => setIsHovered(subreadit.id)}
                      onMouseLeave={() => setIsHovered("")}
                      onClick={() => leaveSubreadit(currentUser.uid, subreadit)}
                    >
                      {isHovered === subreadit.id ? "Leave" : "Joined"}
                    </Button>
                  )}
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
  border: 1px solid ${(props) => props.theme.neutral};
  background: ${(props) => props.theme.backgroundSecondary};
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
  color: ${(props) => props.theme.secondary};
`;

const Button = styled.button`
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
  width: 6rem;
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.backgroundSecondary};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};

  &::disabled {
    background-color: ${(props) => props.theme.disabled};
    border: 1px solid ${(props) => props.theme.disabled};
  }
`;
