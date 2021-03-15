import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

function Title({ title, setTitle }) {
  return (
    <Container>
      <label htmlFor="title">
        <Input
          type="text"
          value={title}
          id="title"
          name="title"
          onChange={(e) => {
            e.target.value.length > 300
              ? setTitle(e.target.value.slice(0, 300))
              : setTitle(e.target.value);
          }}
          placeholder="Title"
        />
      </label>
      <TitleLength>
        {title.length}
        /300
      </TitleLength>
    </Container>
  );
}

export default Title;

Title.propTypes = {
  title: PropTypes.string,
  setTitle: PropTypes.func.isRequired,
};

Title.defaultProps = {
  title: "",
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1rem;
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.border_secondary};
  background: ${(props) => props.theme.input_bg};

  &:focus-within {
    border: 1px solid ${(props) => props.theme.border_active};
  }
`;

const TitleLength = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
`;

const Input = styled.input`
  border: none;
  width: 100%;
  background: ${(props) => props.theme.input_bg};
  color: ${(props) => props.theme.text_primary};

  &:focus {
    outline: 1px solid transparent;
  }
`;
