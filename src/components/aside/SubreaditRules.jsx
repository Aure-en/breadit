import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useSubreadit from "../../hooks/useSubreadit";

function SubreaditRules({ subreaditId }) {
  const [name, setName] = useState("");
  const [rules, setRules] = useState([]);
  const { getSubreaditById } = useSubreadit();

  useEffect(() => {
    if (!subreaditId) return;
    (async () => {
      const subreadit = await getSubreaditById(subreaditId);
      setName(subreadit.data().name);
      setRules(subreadit.data().rules);
    })();
  }, []);

  return (
    <Container>
      <Heading>{name}</Heading>
      <RulesList>
        {rules.map((rule) => {
          return <li key={rule}>{rule}</li>;
        })}
      </RulesList>
    </Container>
  );
}

SubreaditRules.propTypes = {
  subreaditId: PropTypes.string.isRequired,
};

export default SubreaditRules;

const Container = styled.div`
  padding: 1rem;
  background: ${(props) => props.theme.backgroundSecondary};
  border-radius: 5px;
`;

const Heading = styled.h2`
  font-size: 1.25rem;
`;

const RulesList = styled.ol``;
