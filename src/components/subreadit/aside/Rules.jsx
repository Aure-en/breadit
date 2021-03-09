import React, { useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useDropdown from "../../../hooks/useDropdown";

// Icons
import { ReactComponent as IconDown } from "../../../assets/icons/general/icon-down.svg";
import { ReactComponent as IconUp } from "../../../assets/icons/general/icon-up.svg";

function Rules({ subreaditName, rules }) {
  return (
    <Container>
      <Header>
        b/{subreaditName}
        {' '}
        Rules
      </Header>
      <ol>
        {rules.map((rule) => {
          return <Rule key={rule.title} rule={rule} />;
        })}
      </ol>
    </Container>
  );
}

function Rule({ rule }) {
  const dropdownRef = useRef();
  const { isDropdownOpen, setIsDropdownOpen } = useDropdown(dropdownRef, false);

  return (
    <Li ref={dropdownRef}>
      <DropdownHeader
        type="button"
        isDropdownOpen={isDropdownOpen}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Title>{rule.title}</Title>

        {isDropdownOpen ? <IconUp /> : <IconDown />}
      </DropdownHeader>

      {isDropdownOpen && <DropdownList>{rule.description}</DropdownList>}
    </Li>
  );
}

export default Rules;

Rules.propTypes = {
  subreaditName: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
};

Rules.defaultProps = {
  rules: [],
};

Rule.propTypes = {
  rule: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

const Container = styled.aside`
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.backgroundSecondary};
  line-height: 1.25rem;
  border-radius: 0.25rem;
  box-shadow: 0 2px 3px -4px ${(props) => props.theme.shadow};
  border: 1px solid ${(props) => props.theme.border};
`;

const Header = styled.div`
  color: ${(props) => props.theme.backgroundSecondary};
  background: ${(props) => props.theme.accent};
  padding: 0.75rem 1rem;
  font-weight: 500;
  border-radius: 0.25rem 0.25rem 0 0;
`;

const Li = styled.li`
  padding: 0 1rem;
  &::marker {
    font-weight: 500;
  }
`;

const DropdownHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
`;

const Title = styled.div`
  font-weight: 500;
`;

const DropdownList = styled.div`
  padding-right: 1.5rem;
`;
