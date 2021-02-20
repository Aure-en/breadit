import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

function Sort({ setSort, sort }) {
  return (
    <Container>
      <Option
        type="button"
        onClick={() => setSort("new")}
        isSelected={sort === "new"}
      >
        New
      </Option>
      <Option
        type="button"
        onClick={() => setSort("top")}
        isSelected={sort === "top"}
      >
        Top
      </Option>
    </Container>
  );
}

export default Sort;

const Container = styled.div``;

const Option = styled.button`
  font-weight: ${(props) => props.isSelected && "500"};
`;

Sort.propTypes = {
  setSort: PropTypes.func.isRequired,
  sort: PropTypes.string,
};

Sort.defaultProps = {
  sort: "new",
};
