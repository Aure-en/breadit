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
  border: 1px solid ${(props) => props.theme.neutral};
  margin: 1rem 0;
  padding: 0.5rem 0;

  &:hover {
    border: 1px solid ${(props) => props.theme.borderHover};
  }

  @media all and (min-width: 768px) {
    border-radius: 0.25rem;
  }
`;

const Option = styled.button`
  display: flex;
  align-items: center;
  font-weight: ${(props) => props.isSelected && "500"};
  color: ${(props) =>
    props.isSelected ? props.theme.accent : props.theme.secondary};
  background: ${(props) => props.isSelected && props.theme.backgroundTertiary};
  padding: .25rem .85rem;
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
