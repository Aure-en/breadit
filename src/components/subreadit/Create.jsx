import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useUser from "../../hooks/useUser";

// Icons
import { ReactComponent as IconImage } from "../../assets/icons/general/icon-image.svg";
import { ReactComponent as IconLink } from "../../assets/icons/general/icon-link.svg";

function Create({ subreadit }) {
  const { currentUser } = useAuth();
  const { getUser } = useUser();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      if (!currentUser) {
        setUser(null);
      } else {
        const user = await getUser(currentUser.uid);
        setUser(user.data());
      }
    })();
  }, [currentUser]);

  return (
    <Container>
      {user && <Icon src={user.avatar} />}
      <Link
        to={{
          pathname: "/submit",
          subreadit: {
            id: subreadit.id,
            name: subreadit.name,
          },
        }}
      >
        <Input>Create Post</Input>
      </Link>

      <LinkIcon
        to={{
          pathname: "/submit",
          community: {
            id: subreadit.id,
            name: subreadit.name,
          },
          type: "image",
        }}
        data-tip="Create Image Post"
      >
        <IconImage />
      </LinkIcon>

      <LinkIcon
        to={{
          pathname: "/submit",
          community: {
            id: subreadit.id,
            name: subreadit.name,
          },
          type: "link",
        }}
        data-tip="Create Link Post"
      >
        <IconLink />
      </LinkIcon>
      <ReactTooltip effect="solid" delayShow={300} />
    </Container>
  );
}

export default Create;

Create.propTypes = {
  subreadit: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr repeat(2, auto);
  background: ${(props) => props.theme.backgroundSecondary};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.25rem;
  box-shadow: 0 0 5px -4px ${(props) => props.theme.shadow};
  margin-bottom: 1rem;
  padding: 0.5rem;
  align-items: stretch;
`;

const Icon = styled.img`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.accentBackground};
  background: ${(props) => props.theme.backgroundQuaternary};
`;

const Input = styled.div`
  background: ${(props) => props.theme.accentBackground};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.25rem;
  height: 100%;
  cursor: text;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  color: ${(props) => props.theme.secondary};
  font-size: 0.825rem;

  &:hover {
    border: 1px solid ${(props) => props.theme.accent};
  }
`;

const LinkIcon = styled(Link)`
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
  width: 2.25rem;
  height: 2.25rem;
  justify-content: center;
  color: ${(props) => props.theme.secondary};

  &:hover {
    background: ${(props) => props.theme.accentBackground};
  }
`;
