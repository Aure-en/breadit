import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { useAuth } from "../../../contexts/AuthContext";
import useUserSettings from "../../../hooks/useUserSettings";

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
    try {
      await checkPassword(currentUser, currentUser.email, password);
    } catch (err) {
      switch (err) {
        case "auth/wrong-password":
          setPasswordError("The password is incorrect.");
          break;
        default:
          setPasswordError("The credential is invalid.");
      }
    }
    deleteAccount(currentUser);
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
            backgroundColor: colors.overlay,
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

const colors = {
  primary: "black",
  secondary: "grey",
  accent: "red",
  disabled: "blue",
  background: "white",
  overlay: "rgba(0, 0, 0, .8)",
};

const SettingsModal = styled(Modal)`
  background: ${colors.background};
  width: 100%;
  max-width: 25rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 3rem;
  border-radius: 5px;

  &:focus {
    outline: none;
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
  border: 1px solid ${colors.accent};
  color: ${colors.accent};
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  align-self: center;
`;

const ButtonFilled = styled(Button)`
  color: ${colors.background};
  background-color: ${colors.accent};
  border: 1px solid ${colors.accent};

  &::disabled {
    background-color: ${colors.disabled};
    border: 1px solid ${colors.disabled};
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
  margin: 0.75rem 0;
  width: 100%;
  padding: 0.75rem;
  border-radius: 3px;
  border: 1px solid ${colors.border};

  &:focus {
    outline: none;
    border: 1px solid ${colors.accent};
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
  color: ${colors.secondary};
  margin-bottom: 0.5rem;
`;

const MessageError = styled(Message)`
  color: ${colors.error};
  top: -0.5rem;
`;
