import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useSubreadit from "../../hooks/useSubreadit";
import About from "../../components/subreadit/aside/About";
import Rules from "../../components/subreadit/aside/Rules";

function Information({ subreaditName }) {
  const [subreadit, setSubreadit] = useState();
  const { getSubreaditByName } = useSubreadit();

  useEffect(() => {
    (async () => {
      const subreadit = await getSubreaditByName(subreaditName);
      setSubreadit(subreadit);
    })();
  }, [subreaditName]);

  return (
    <Container>
      {subreadit && (
        <>
          <About
            description={subreadit.description}
            members={subreadit.members}
            date={subreadit.date}
          />
          {subreadit.rules.length > 0 && (
            <Rules rules={subreadit.rules} subreaditName={subreaditName} />
          )}
        </>
      )}
    </Container>
  );
}

export default Information;

Information.propTypes = {
  subreaditName: PropTypes.string.isRequired,
};

const Container = styled.div`
  margin-top: 1rem;

  & > * {
    margin-bottom: 1rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
