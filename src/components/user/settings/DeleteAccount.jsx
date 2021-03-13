import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { useAuth } from "../../../contexts/AuthContext";
import useUserSettings from "../../../hooks/useUserSettings";
import { colors } from "../../../styles/themes/light";

// Icons
import { ReactComponent as IconClose } from "../../../assets/icons/general/icon-x.svg";
import { ReactComponent as IconDelete } from "../../../assets/icons/settings/icon-delete.svg";

function DeleteAccount() {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { checkPassword, deleteAccount } = useUserSettings();
  const { currentUser } = useAuth();

  const clear = () => {
    setPasswordError("");
  };

  const closeModal = () => {
    setPassword("");
    clear();
    setIsModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      setPasswordError("This field is required");
      return;
    }

    try {
      await checkPassword(currentUser, currentUser.email, password);
      await deleteAccount(currentUser);
    } catch (err) {
      setPasswordError("The password is incorrect.");
    }
  };

  return (
    <>
      <Button type="button" onClick={() => setIsModalOpen(true)}>
        Delete
      </Button>

      <SettingsModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: colors.settings_overlay,
          },
        }}
      >
        <ButtonClose onClick={closeModal}>
          <IconClose />
        </ButtonClose>
        <Subheading>
          <IconDelete />
          Delete your account
        </Subheading>
        <ModalText>
          Are you sure you would like to delete your account? <br />
          You will be unable to recover it.
        </ModalText>
        <Message>
          Deactivating your account will not delete the content of posts and
          comments you've made on Breadit. To do so please delete them
          individually.
        </Message>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDeleteAccount();
          }}
        >
          <div>
            <label htmlFor="delete_password">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="delete_password"
                name="delete_password"
                placeholder="Current Password"
                hasError={passwordError}
              />
            </label>
            <MessageError>{passwordError}</MessageError>
          </div>

          <ButtonsRight>
            <Button type="button">Cancel</Button>
            <ButtonFilled type="submit">Delete</ButtonFilled>
          </ButtonsRight>
        </form>
      </SettingsModal>
    </>
  );
}

export default DeleteAccount;

const SettingsModal = styled(Modal)`
  background: ${(props) => props.theme.bg_container};
  width: 75vw;
  max-width: 25rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 3rem;
  border-radius: 5px;

  &:focus {
    outline: 1px solid transparent;
  }

  @media all and (min-width: 500px) {
    width: 100vw;
  }
`;

const ButtonsRight = styled.div`
  display: flex;
  justify-content: flex-end;

  & > * {
    margin-left: 1rem;
  }

  & > *:first-child {
    margin-left: 0;
  }
`;

const Button = styled.button`
  display: block;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
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

const Subheading = styled.h3`
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 2.5rem;
  display: flex;
  align-items: center;

  & > svg {
    margin-right: 1rem;
  }
`;

const Input = styled.input`
  margin: 0.75rem 0 0.25rem 0;
  padding: 0.75rem;
  border-radius: 3px;
  width: 100%;
  border: 1px solid
    ${(props) =>
      props.hasError ? props.theme.error : props.theme.text_secondary};

  &:focus {
    outline: 1px solid transparent;
    border: 1px solid ${(props) => props.theme.accent};
  }

  &::placeholder {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 0.75rem;
  }
`;

const ButtonClose = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`;

const ModalText = styled.p`
  font-size: 1rem;
  line-height: 1.25rem;
  margin: 1rem 0;
`;

const Message = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.text_secondary};
  margin-bottom: 0.5rem;
`;

const MessageError = styled(Message)`
  color: ${(props) => props.theme.error};
  top: -0.5rem;
`;
