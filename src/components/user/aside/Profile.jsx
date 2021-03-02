import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { format } from "date-fns";
import useUser from "../../../hooks/useUser";

function Profile({ userId }) {
  const [user, setUser] = useState();
  const { getUser, getKarma } = useUser();

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const data = await getUser(userId);
      const karma = await getKarma(userId);
      setUser({ ...data.data(), karma });
    })();
  }, []);

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
        </Container>
      )}
    </>
  );
}

Profile.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default Profile;

const colors = {
  background: "white",
  secondary: "grey",
};

const Container = styled.aside`
  position: relative;
  width: 20rem;
  margin-left: 3rem;
  padding: 8rem 1rem 1rem 1rem;
  background: ${colors.background};
  line-height: 1.25rem;
  border-radius: 5px;
`;

const Banner = styled.img`
  position: absolute;
  width: 20rem;
  height: 5rem;
  left: 0;
  top: 0;
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
  color: ${colors.secondary};
  font-weight: initial;
`;
