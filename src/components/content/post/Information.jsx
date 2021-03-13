import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { Link, useLocation } from "react-router-dom";
import { useSubscription } from "../../../contexts/SubscriptionContext";
import useSubreadit from "../../../hooks/useSubreadit";
import useWindowSize from "../../../hooks/useWindowSize";

// Icons
import { ReactComponent as IconPlus } from "../../../assets/icons/general/icon-plus.svg";

function Information({ subreaditId, author, date, user, className }) {
  const [subreadit, setSubreadit] = useState();
  const { windowSize } = useWindowSize();
  const { subscriptions } = useSubscription();
  const { getSubreaditById, joinSubreadit } = useSubreadit();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const subreadit = await getSubreaditById(subreaditId);
      setSubreadit(subreadit.data());
    })();
  }, []);

  return (
    <>
      {subreadit && (
        <Container className={className}>
          <Icon src={subreadit.icon} alt={`${subreadit.name}'s Icon`} />
          <SubreaditLink to={`/b/${subreadit.name}`}>
            b/
            {subreadit.name}
          </SubreaditLink>
          <Details>
            {" "}
            {windowSize.width > 768 && "• "}
            Posted by{" "}
            <UnderlineLink to={`/u/${author.toLowerCase()}`}>
              {" "}
              u/
              {author}{" "}
            </UnderlineLink>
            {" • "}
            {formatDistanceStrict(new Date(date.seconds * 1000), new Date())}{" "}
            ago
          </Details>
          {(location.pathname === "/b/all" || location.pathname === "/") && (
            <>
              {!subscriptions.includes(subreadit.id) && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    joinSubreadit(user.uid, subreadit);
                  }}
                >
                  <IconPlus />
                  {windowSize.width > 768 && "Join"}
                </Button>
              )}
            </>
          )}
        </Container>
      )}
    </>
  );
}

export default Information;

Information.propTypes = {
  subreaditId: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.shape({
    seconds: PropTypes.number,
  }).isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string,
  }),
  className: PropTypes.string,
};

Information.defaultProps = {
  user: null,
  className: "",
};

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template: repeat(2, auto) / auto 1fr auto;
  font-size: 0.75rem;
  color: ${(props) => props.theme.text_secondary};

  & > * {
    margin-right: 0.25rem;
  }

  & > a:hover {
    text-decoration: underline;
  }

  @media all and (min-width: 768px) {
    grid-template: repeat(2, auto) / repeat(2, auto) 1fr auto;
  }
`;

const SubreaditLink = styled(Link)`
  font-weight: 600;
  color: ${(props) => props.theme.text_primary};
  grid-row: 1;
`;

const Details = styled.div`
  grid-row: 2;
  grid-column: 2;
  line-height: 0.5rem;

  @media all and (min-width: 768px) {
    grid-row: 1;
    grid-column: 3;
  }
`;

const Icon = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  grid-row: 1 / span 2;
  margin-right: 0.5rem;
  background: ${(props) => props.theme.header_bg};

  @media all and (min-width: 768px) {
    width: 1.5rem;
    height: 1.5rem;
    grid-row: 1;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.bg_container};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.25rem;
  font-weight: 500;
  align-self: center;
  text-align: center;
  grid-row: 1 / span 2;
  grid-column: -1;

  @media all and (min-width: 768px) {
    padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  }
`;

const UnderlineLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;
