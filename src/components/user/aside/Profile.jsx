import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useEntry } from "../../../contexts/EntryContext";
import useUser from "../../../hooks/useUser";

function Profile({ username }) {
  const { currentUser } = useAuth();
  const [user, setUser] = useState();
  const { getUserByName, getKarma } = useUser();
  const { openSignUp } = useEntry();

  useEffect(() => {
    (async () => {
      const user = await getUserByName(username);
      const karma = await getKarma(user.id);
      setUser({ ...user, karma });
    })();
  }, [username]);

  return (
    <>
      {user && (
        <Container>
          <Banner src={user.banner} alt={`${user.username}'s banner`} />
          <Avatar src={user.avatar} alt={`${user.username}'s avatar`} />
          <Heading>{user.username}</Heading>

          <Informations>
            <div>
              <div>Karma</div>
              <Information>{user.karma}</Information>
            </div>
            <div>
              <div>Bread Day</div>
              <Information>
                {format(new Date(user.date.seconds * 1000), "MMM d, yyyy")}
              </Information>
            </div>
          </Informations>

          {currentUser && currentUser.displayName !== username && (
            <Button
              as={Link}
              to={{
                pathname: "/message/compose",
                recipient: user.username,
              }}
            >
              Send a message
            </Button>
          )}

          {!currentUser && (
            <Button type="button" onClick={openSignUp}>
              Send a message
            </Button>
          )}
        </Container>
      )}
    </>
  );
}

Profile.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Profile;

const Container = styled.aside`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 8rem 1rem 1rem 1rem;
  background: ${(props) => props.theme.backgroundSecondary};
  line-height: 1.25rem;
  border-radius: 5px;

  @media all and (min-width: 992px) {
    grid-row: 2;
    grid-column: 3;
    min-width: 15rem;
    box-shadow: 0 2px 3px -4px ${(props) => props.theme.shadow};
    border: 1px solid ${(props) => props.theme.border};
  }
`;

const Banner = styled.img`
  position: absolute;
  width: 20rem;
  height: 5rem;
  left: 0;
  top: 0;
  width: 100%;
  object-fit: cover;
  border-radius: 5px 5px 0 0;
`;

const Avatar = styled.img`
  position: absolute;
  width: 5rem;
  height: 5rem;
  left: 50%;
  top: 2.5rem;
  transform: translateX(-50%);
  border: 2px solid ${(props) => props.theme.backgroundSecondary};
`;

const Heading = styled.h2`
  font-size: 1.125rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const Informations = styled.div`
  display: flex;
  justify-content: space-around;
  font-weight: 500;
`;

const Information = styled.div`
  font-size: 0.825rem;
  color: ${(props) => props.theme.secondary};
  font-weight: initial;
`;

const Button = styled.button`
  display: block;
  color: ${(props) => props.theme.backgroundSecondary};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
  text-align: center;
  margin-top: 1rem;

  &:hover {
    background-color: ${(props) => props.theme.accentHover};
    border: 1px solid ${(props) => props.theme.accentHover};
  }
`;
