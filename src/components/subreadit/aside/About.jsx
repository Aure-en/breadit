import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { format } from "date-fns";
import { Link } from "react-router-dom";

// Icons
import { ReactComponent as IconSettings } from "../../../assets/icons/header/icon-settings.svg";

function About({ subreadit, description, members, date, settings }) {
  return (
    <Container>
      <Header>
        <div>About Community</div>
        {settings && (
          <Link to={`/b/${subreadit}/settings`}>
            <IconSettings />
          </Link>
        )}
      </Header>

      <Main>
        <div>{description}</div>
      </Main>

      <Informations>
        <div>
          <div>Members</div>
          <Information>{members}</Information>
        </div>

        <div>
          <div>Creation Date</div>
          <Information>
            {format(new Date(date.seconds * 1000), "MMM d, yyyy")}
          </Information>
        </div>
      </Informations>
    </Container>
  );
}

export default About;

About.propTypes = {
  description: PropTypes.string,
  members: PropTypes.number,
  date: PropTypes.shape({
    seconds: PropTypes.number,
  }).isRequired,
  settings: PropTypes.bool,
  subreadit: PropTypes.string,
};

About.defaultProps = {
  description: "",
  members: 0,
  settings: false,
  subreadit: "",
};

const Container = styled.aside`
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  background: ${(props) => props.theme.bg_container};
  line-height: 1.25rem;
  border-radius: 0.25rem;
  box-shadow: 0 2px 3px -4px ${(props) => props.theme.shadow};
  border: 1px solid ${(props) => props.theme.border};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => props.theme.bg_container};
  background: ${(props) => props.theme.accent};
  padding: 0.75rem 1rem;
  font-weight: 500;
  border-radius: 0.25rem 0.25rem 0 0;
`;

const Main = styled.div`
  padding: 1rem;
`;

const Informations = styled.div`
  display: flex;
  justify-content: space-around;
  font-weight: 500;
`;

const Information = styled.div`
  font-size: 0.825rem;
  color: ${(props) => props.theme.text_secondary};
  font-weight: initial;
`;
