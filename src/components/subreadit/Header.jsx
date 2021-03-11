import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import { useSubscription } from "../../contexts/SubscriptionContext";
import useWindowSize from "../../hooks/useWindowSize";
import useSubreadit from "../../hooks/useSubreadit";
import JoinButton from "./JoinButton";

function Header({ subreaditName }) {
  const { currentUser } = useAuth();
  const { subscriptions } = useSubscription();
  const [subreadit, setSubreadit] = useState();
  const { getSubreaditByName } = useSubreadit();
  const { windowSize } = useWindowSize();

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
                <Heading>
                  {windowSize.width > 768 && "Welcome to b/"}
                  {subreadit.name_sensitive}
                </Heading>
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
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  display: flex;
  justify-content: center;

  @media all and (min-width: 992px) {
    border-bottom: 1px solid ${(props) => props.theme.border};
  }
`;

const Content = styled.div`
  padding: 4rem 0 1rem 0;
  width: 90%;

  @media all and (min-width: 992px) {
    display: flex;
    width: 63rem;
    align-items: flex-end;
  }
`;

const Icon = styled.img`
  width: 5.5rem;
  height: 5.5rem;
  border: 3px solid ${(props) => props.theme.backgroundSecondary};
  border-radius: 50%;
  margin-right: 1rem;
  background: ${(props) => props.theme.backgroundQuaternary};
`;

const Informations = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

const Heading = styled.h2`
  line-height: 1rem;
  margin-bottom: 0.25rem;

  @media all and (min-width: 992px) {
    font-size: 1.75rem;
    line-height: 2rem;
  }
`;

const Subheading = styled.div`
  font-size: 0.825rem;
  color: ${(props) => props.theme.secondary};
`;
