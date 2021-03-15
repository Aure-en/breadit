import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { ReactComponent as IconPost } from "../../assets/icons/general/icon-post.svg";
import { ReactComponent as IconImage } from "../../assets/icons/general/icon-image.svg";
import { ReactComponent as IconLink } from "../../assets/icons/general/icon-link.svg";

function Type({ type, setType }) {
  return (
    <Tabs>
      <Tab
        type="button"
        onClick={() => setType("post")}
        isSelected={type === "post"}
      >
        <IconPost /> Post
      </Tab>
      <Tab
        type="button"
        onClick={() => setType("image")}
        isSelected={type === "image"}
      >
        <IconImage /> Image
      </Tab>
      <Tab
        type="button"
        onClick={() => setType("link")}
        isSelected={type === "link"}
      >
        <IconLink /> Link
      </Tab>
    </Tabs>
  );
}

export default Type;

Type.propTypes = {
  type: PropTypes.string,
  setType: PropTypes.func.isRequired,
};

Type.defaultProps = {
  type: "post",
};

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.border_secondary};
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  border-left: 1px solid ${(props) => props.theme.border_secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: -0.5rem;
  font-weight: ${(props) => props.isSelected && "500"};
  color: ${(props) =>
    props.isSelected ? props.theme.accent_secondary : props.theme.text_primary};
  border-bottom: ${(props) =>
    props.isSelected
      ? `2px solid ${props.theme.accent_secondary}`
      : "2px solid transparent"};

  & > *:first-child {
    margin-right: 0.5rem;
  }
`;
