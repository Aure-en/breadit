import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { format } from "date-fns";
import useSubreadit from "../../hooks/useSubreadit";

const colors = {
  background: "white",
};

const Container = styled.div`
  padding: 1rem;
  background: ${colors.background};
  border-radius: 5px;
`;

const Banner = styled.img`
  max-width: 100%;
  height: 3rem;
`;

const Icon = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
`;

const Heading = styled.h2``;

function SubreaditInfo({ subreaditId }) {
  const [subreadit, setSubreadit] = useState();
  const { getSubreaditById } = useSubreadit();

  useEffect(() => {
    if (!subreaditId) return;
    (async () => {
      const subreadit = await getSubreaditById(subreaditId);
      setSubreadit(subreadit.data());
    })();
  }, []);

  return (
    <>
      {subreadit && (
        <Container>
          <Banner src={subreadit.banner} alt={`${subreadit.name}'s banner`} />
          <div>
            <Icon src={subreadit.icon} alt={`${subreadit.name}'s icon`} />
            <Heading>{subreadit.name}</Heading>
          </div>
          <p>{subreadit.description}</p>
          <div>{subreadit.members.length} members</div>
          <div>
            {format(new Date(subreadit.date.seconds * 1000), "MMM d, yyyy")}
          </div>
        </Container>
      )}
    </>
  );
}

SubreaditInfo.propTypes = {
  subreaditId: PropTypes.string.isRequired,
};

export default SubreaditInfo;
