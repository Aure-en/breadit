import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import { useSubscription } from "../../contexts/SubscriptionContext";
import useSubreadit from "../../hooks/useSubreadit";
import JoinButton from "./JoinButton";

function Header({ subreaditName }) {
  const { currentUser } = useAuth();
  const { subscriptions } = useSubscription();
  const [subreadit, setSubreadit] = useState();
  const { getSubreaditByName } = useSubreadit();

  useEffect(() => {
    if (!subreaditName) return;
    (async () => {
      const subreadit = await getSubreaditByName(subreaditName);
      setSubreadit(subreadit);
    })();
  }, [subreaditName]);

  return (
    <>
      {subreadit && (
        <Container banner={subreadit.banner}>
          <Content>
            <Icon src={subreadit.icon} alt={`${subreadit.name}'s icon`} />
            <Informations>
              <div>
                <Heading>{subreadit.name_sensitive}</Heading>
                <Subheading>
                  b/
                  {subreadit.name}
                </Subheading>
              </div>
              <JoinButton
                subscriptions={subscriptions}
                subreadit={subreadit}
                user={currentUser}
              />
            </Informations>
          </Content>
        </Container>
      )}
    </>
  );
}

export default Header;

Header.propTypes = {
  subreaditName: PropTypes.string.isRequired,
};

const Container = styled.div`
  background-image: linear-gradient(
      to bottom,
      transparent 50%,
      ${(props) => props.theme.backgroundSecondary} 50%
    ),
    url(${(props) => props.banner});
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  padding: 4rem 0 1rem 0;
  width: 90%;

  @media all and (min-width: 768px) {
    display: flex;
  }
`;

const Icon = styled.img`
  width: 5.5rem;
  height: 5.5rem;
  border: 3px solid ${(props) => props.theme.backgroundSecondary};
  border-radius: 50%;
`;

const Informations = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Heading = styled.h2`
  line-height: 1rem;
  margin-bottom: 0.25rem;
`;

const Subheading = styled.div`
  font-size: 0.825rem;
  color: ${(props) => props.theme.secondary};
`;
