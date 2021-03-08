import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// Icons
import { ReactComponent as IconTop } from "../../assets/icons/sort/icon-top.svg";
import { ReactComponent as IconNew } from "../../assets/icons/sort/icon-new.svg";

function Sort({ setSort, sort }) {
  return (
    <Container>
      <Option
        type="button"
        onClick={() => setSort("new")}
        isSelected={sort === "new"}
      >
        <IconNew />
        New
      </Option>
      <Option
        type="button"
        onClick={() => setSort("top")}
        isSelected={sort === "top"}
      >
        <IconTop />
        Top
      </Option>
    </Container>
  );
}

export default Sort;

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  background: ${(props) => props.theme.backgroundSecondary};
  border: 1px solid ${(props) => props.theme.border};
  margin-bottom: 1rem;

  @media all and (min-width: 768px) {
    border-radius: 0.25rem;
  }
`;

const Option = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${(props) => props.isSelected && "500"};
  color: ${(props) =>
    props.isSelected ? props.theme.accent : props.theme.secondary};
  padding: .5rem .85rem;
  border-radius: 1rem;

  & > svg {
    margin-right: 0.5rem;
  }
`;

Sort.propTypes = {
  setSort: PropTypes.func.isRequired,
  sort: PropTypes.string,
};

Sort.defaultProps = {
  sort: "new",
};
