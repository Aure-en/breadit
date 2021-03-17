import React from "react";
import styled from "styled-components";

// Icons
import { ReactComponent as IconClose } from "../../../assets/icons/general/icon-x.svg";

function Delete({ closeModal, type, onDelete }) {
  return (
    <Overlay onClick={closeModal}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Header>
          <div>
            Delete
            {" "}
            {type}
          </div>
          <Icon type="button" onClick={closeModal}>
            <IconClose />
          </Icon>
        </Header>
        <Content>Are you sure you want to delete this {type}?</Content>
        <Buttons>
          <Button type="button" onClick={closeModal}>
            Keep
          </Button>
          <ButtonFilled
            type="button"
            onClick={() => {
              onDelete();
              closeModal();
            }}
          >
            Delete
          </ButtonFilled>
        </Buttons>
      </Container>
    </Overlay>
  );
}

export default Delete;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${(props) => props.theme.overlay};
  z-index: 99;
`;

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  color: ${(props) => props.theme.text_primary};
  background: ${(props) => props.theme.bg_container};
  font-size: 0.875rem;
  font-weight: 400;
  width: 80vw;
  max-width: 25rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 15rem;
  align-self: center;
  text-align: center;
`;

const Icon = styled.button`
  color: ${(props) => props.theme.text_primary};
`;

const Buttons = styled.div`
  display: flex;
  align-self: flex-end;
  padding: 0.5rem 1rem;

  & > button:first-child {
    margin-right: 0.5rem;
  }
`;

const Button = styled.button`
  display: block;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.35rem 1.25rem;
  font-weight: 500;
  text-align: center;

  &:hover {
    color: ${(props) => props.theme.accent_active};
    border: 1px solid ${(props) => props.theme.accent_active};
  }
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.bg_container};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};

  &:hover {
    color: ${(props) => props.theme.bg_container};
    background-color: ${(props) => props.theme.accent_active};
    border: 1px solid ${(props) => props.theme.accent_active};
  }
`;
