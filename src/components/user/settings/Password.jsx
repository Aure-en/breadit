import React, { useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import Modal from "react-modal";
import { useAuth } from "../../../contexts/AuthContext";
import useUserSettings from "../../../hooks/useUserSettings";

// Icons
import { ReactComponent as IconClose } from "../../../assets/icons/general/icon-x.svg";
import { ReactComponent as IconPassword } from "../../../assets/icons/settings/icon-password.svg";

function Password() {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [
    newPasswordConfirmationError,
    setNewPasswordConfirmationError,
  ] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    checkPassword,
    checkConfirmation,
    updatePassword,
  } = useUserSettings();
  const { currentUser } = useAuth();
  const themeContext = useContext(ThemeContext);

  const clear = () => {
    setPasswordError("");
    setNewPasswordError("");
    setNewPasswordConfirmationError("");
    setMessage("");
  };

  const closeModal = () => {
    setPassword("");
    setNewPassword("");
    setNewPasswordConfirmation("");
    clear();
    setIsModalOpen(false);
  };

  const handleUpdatePassword = async () => {
    clear();
    let areFieldsFilled = true;

    if (!password) {
      setPasswordError("This field is required");
      areFieldsFilled = false;
    }

    if (!newPassword) {
      setNewPasswordError("This field is required");
      areFieldsFilled = false;
    }

    if (!newPasswordConfirmation) {
      setNewPasswordConfirmationError("This field is required");
      areFieldsFilled = false;
    }

    if (!areFieldsFilled) return;

    try {
      await checkPassword(currentUser, currentUser.email, password);
    } catch (err) {
      setPasswordError("The password is incorrect.");
      return;
    }

    if (!checkConfirmation(newPassword, newPasswordConfirmation)) {
      setNewPasswordError("New passwords do not match.");
      setNewPasswordConfirmationError("New passwords do not match.");
      return;
    }

    try {
      await updatePassword(currentUser, newPassword);
      closeModal();
    } catch (err) {
      switch (err.code) {
        case "auth/weak-password":
          setNewPasswordError("Must be 6 or more in length.");
          break;
        default:
          setMessage("Sorry, we were unable to update your information.");
      }
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Change
      </Button>

      <SettingsModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: themeContext.overlay,
          },
        }}
      >
        <ButtonClose onClick={closeModal}>
          <IconClose />
        </ButtonClose>
        <Subheading>
          <IconPassword />
          Update your password
        </Subheading>
        <ModalText>
          Update your password below by entering your current and new passwords.
        </ModalText>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdatePassword();
          }}
        >
          <div>
            <label htmlFor="password_password">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="email_password"
                name="email_password"
                placeholder="Current Password"
                hasError={passwordError}
              />
            </label>
            <MessageError>{passwordError}</MessageError>
          </div>

          <div>
            <label htmlFor="new_password">
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                id="new_password"
                name="new_password"
                placeholder="New Password"
                hasError={newPasswordError}
              />
            </label>
            <MessageError>{newPasswordError}</MessageError>
          </div>

          <div>
            <label htmlFor="new_password_confirmation">
              <Input
                type="password"
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                id="new_password_confirmation"
                name="new_password_confirmation"
                placeholder="Confirm New Password"
                hasError={newPasswordConfirmationError}
              />
            </label>
            <MessageError>{newPasswordConfirmationError}</MessageError>
          </div>

          <ButtonsRight>
            <ButtonFilled type="submit">Save</ButtonFilled>
          </ButtonsRight>
          <Message>{message}</Message>
        </form>
      </SettingsModal>
    </>
  );
}

export default Password;

const SettingsModal = styled(Modal)`
  background: ${(props) => props.theme.bg_container};
  max-width: 25rem;
  width: 75vw;
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
  margin-top: 1rem;

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
    ${(props) => (props.hasError ? props.theme.error : props.theme.text_secondary)};
  background: ${(props) => props.theme.input_bg};
  color: ${(props) => props.theme.text_primary};

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
