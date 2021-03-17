import React, { useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import Modal from "react-modal";
import { useAuth } from "../../../contexts/AuthContext";
import useUserSettings from "../../../hooks/useUserSettings";
import { toastify } from "../../shared/Toast";

// Icons
import { ReactComponent as IconClose } from "../../../assets/icons/general/icon-x.svg";
import { ReactComponent as IconMail } from "../../../assets/icons/settings/icon-mail.svg";

function Email() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { checkPassword, updateEmail } = useUserSettings();
  const { currentUser } = useAuth();
  const themeContext = useContext(ThemeContext);

  const clear = () => {
    setPasswordError("");
    setEmailError("");
    setMessage("");
  };

  const closeModal = () => {
    setPassword("");
    setEmail("");
    clear();
    setIsModalOpen(false);
  };

  const handleUpdateEmail = async () => {
    clear();

    let areFieldsFilled = true;

    if (!password) {
      setPasswordError("This field is required");
      areFieldsFilled = false;
    }

    if (!email) {
      setEmailError("This field is required");
      areFieldsFilled = false;
    }

    if (!areFieldsFilled) return;

    const check = await checkPassword(currentUser, currentUser.email, password);
    if (check) {
      setPasswordError("The password is incorrect.");
      return;
    }

    try {
      await updateEmail(currentUser, email);
      toastify("Email successfully updated");
      closeModal();
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
          setEmailError("Not a well formed email address.");
          break;
        case "auth/email-already-in-use":
          setEmailError("This email is already registered.");
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
          <IconMail />
          Update your email
        </Subheading>
        <ModalText>
          Update your email below by entering your new email address and current
          password.
        </ModalText>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateEmail();
          }}
        >
          <div>
            <label htmlFor="email_password">
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
            <label htmlFor="email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                placeholder="New Email Address"
                hasError={emailError}
              />
            </label>
            <MessageError>{emailError}</MessageError>
            <Message>{message}</Message>
          </div>

          <ButtonsRight>
            <ButtonFilled type="submit">
              Save email
            </ButtonFilled>
          </ButtonsRight>
        </form>
      </SettingsModal>
    </>
  );
}

export default Email;

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
    outline: none;
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
    color: ${(props) => props.theme.accentHover};
    border: 1px solid ${(props) => props.theme.accent_hover};
  }
`;

const ButtonFilled = styled(Button)`
  color: ${(props) => props.theme.bg_container};
  background-color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};

  &:hover {
    color: ${(props) => props.theme.backgroundSecondary};
    background-color: ${(props) => props.theme.accent_hover};
    border: 1px solid ${(props) => props.theme.accent_hover};
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
  background: ${(props) => props.theme.input_bg};
  color: ${(props) => props.theme.text_primary};

  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.accent};
  }

  &::placeholder {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 0.75rem;
  }
`;

const ButtonClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  color: ${(props) => props.theme.text_primary};
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
