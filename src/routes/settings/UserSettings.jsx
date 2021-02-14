import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { useAuth } from "../../contexts/AuthContext";
import useUserSettings from "../../hooks/useUserSettings";

// Icons
import { ReactComponent as IconClose } from "../../assets/icons/general/icon-x.svg";
import { ReactComponent as IconMail } from "../../assets/icons/settings/icon-mail.svg";
import { ReactComponent as IconPassword } from "../../assets/icons/settings/icon-password.svg";
import { ReactComponent as IconDelete } from "../../assets/icons/settings/icon-delete.svg";

const colors = {
  primary: "black",
  secondary: "grey",
  accent: "red",
  disabled: "blue",
  background: "white",
  overlay: "rgba(0, 0, 0, .8)",
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem;
  flex: 1;
`;

const Container = styled.div`
  width: 100%;
  max-width: 50rem;
`;

const ImageInput = styled.input`
  display: none;
`;

const Avatar = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 5px;
  cursor: pointer;
`;

const Banner = styled.img`
  width: 15rem;
  height: 5rem;
  border-radius: 5px;
  cursor: pointer;
`;

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

const ModalText = styled.p`
  font-size: 1rem;
  line-height: 1.25rem;
  margin: 1rem 0;
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

const ButtonClose = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`;

const Heading = styled.h1`
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 3rem;
  margin-bottom: 1rem;
`;

const Category = styled.h2`
  font-weight: 500;
  font-size: 0.75rem;
  text-transform: uppercase;
  line-height: 1.5rem;
  color: ${colors.secondary};
  border-bottom: 1px solid ${colors.secondary};
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

const Setting = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
`;

const About = styled.div`
  margin: 2rem 0;
`;

const SettingType = styled.h3`
  font-weight: 500;
  font-size: 1rem;
  line-height: 2rem;
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

const Field = styled.div``;

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

const Textarea = styled.textarea`
  width: 100%;
  min-height: 8rem;
`;

const Label = styled.label``;

function UserSettings() {
  const { currentUser } = useAuth();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    email,
    setEmail,
    emailError,
    currentPassword,
    setCurrentPassword,
    currentPasswordError,
    newPassword,
    setNewPassword,
    newPasswordError,
    newPasswordConfirmation,
    setNewPasswordConfirmation,
    newPasswordConfirmationError,
    message,
    about,
    setAbout,
    aboutMessage,
    reset,
    avatar,
    handleUpdateEmail,
    handleUpdatePassword,
    handleUpdateAbout,
    handleUpdateAvatar,
    handleDeleteAccount,
  } = useUserSettings();
  useUserSettings();

  return (
    <Wrapper>
      <Container>
        <Heading>User Settings</Heading>

        <Category>Account preferences</Category>

        <Setting>
          <div>
            <SettingType>Username</SettingType>
            <div>{currentUser.displayName}</div>
          </div>
        </Setting>

        <Setting>
          <div>
            <SettingType>Email address</SettingType>
            <Message>{currentUser.email}</Message>
          </div>
          <Button
            type="button"
            onClick={() => {
              setIsEmailModalOpen(true);
              reset();
            }}
          >
            Change
          </Button>
        </Setting>

        <Setting>
          <div>
            <SettingType>Change Password</SettingType>
            <Message>Password must be at least 6 characters long</Message>
          </div>
          <Button
            type="button"
            onClick={() => {
              setIsPasswordModalOpen(true);
              reset();
            }}
          >
            Change
          </Button>
        </Setting>

        <Category>Profile Information</Category>

        <About>
          <div>
            <SettingType>About (optional)</SettingType>
            <Message>
              A brief description of yourself shown on your profile.
            </Message>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateAbout();
              }}
            >
              <Label htmlFor="about" />
              <Textarea
                id="about"
                name="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
              <Message>{aboutMessage}</Message>
              <ButtonsRight>
                <ButtonFilled type="submit">Save</ButtonFilled>
              </ButtonsRight>
            </form>
          </div>
        </About>

        <Setting>
          <div>
            <SettingType>Avatar and banner image</SettingType>
            <Message>Images must be .png or .jpg format</Message>
            <ImageInput
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => {
                if (e.target.files.length > 0)
                  handleUpdateAvatar(e.target.files[0]);
              }}
            />
            <label htmlFor="avatar">
              <Avatar src={avatar} alt="Current avatar" />
            </label>
          </div>
        </Setting>

        <Category>Deactivate account</Category>

        <Setting>
          <div>
            <SettingType>Account Removal</SettingType>
            <Message>
              If you delete your account, you will not be able to recover it.
            </Message>
          </div>
          <Button type="button" onClick={() => setIsDeleteModalOpen(true)}>
            Delete
          </Button>
        </Setting>
      </Container>

      {/* Email change modal */}
      <SettingsModal
        isOpen={isEmailModalOpen}
        onRequestClose={() => setIsEmailModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: colors.overlay,
          },
        }}
      >
        <ButtonClose onClick={() => setIsEmailModalOpen(false)}>
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
          onSubmit={async (e) => {
            e.preventDefault();
            const wasChanged = await handleUpdateEmail();
            if (wasChanged) {
              {
                /* setTimeout is used so that the user can read a confirmation message before the modal closes */
              }
              setTimeout(() => {
                setIsEmailModalOpen(false);
                reset();
              }, 1000);
            }
          }}
        >
          <Field>
            <label htmlFor="email_password">
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                id="email_password"
                name="email_password"
                placeholder="Current Password"
              />
            </label>
            <MessageError>{currentPasswordError}</MessageError>
          </Field>

          <Field>
            <label htmlFor="email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                placeholder="New Email Address"
              />
            </label>
            <MessageError>{emailError}</MessageError>
          </Field>

          <ButtonsRight>
            <ButtonFilled type="submit" disabled={!email || !currentPassword}>
              Save email
            </ButtonFilled>
          </ButtonsRight>
          <Message>{message}</Message>
        </form>
      </SettingsModal>

      {/* Password change modal */}
      <SettingsModal
        isOpen={isPasswordModalOpen}
        onRequestClose={() => setIsPasswordModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: colors.overlay,
          },
        }}
      >
        <ButtonClose onClick={() => setIsPasswordModalOpen(false)}>
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
          onSubmit={async (e) => {
            e.preventDefault();
            const wasChanged = await handleUpdatePassword();
            if (wasChanged) {
              {
                /* setTimeout is used so that the user can read a confirmation message before the modal closes */
              }
              setTimeout(() => {
                setIsPasswordModalOpen(false);
                reset();
              }, 1000);
            }
          }}
        >
          <Field>
            <label htmlFor="password_password">
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                id="email_password"
                name="email_password"
                placeholder="Current Password"
              />
            </label>
            <MessageError>{currentPasswordError}</MessageError>
          </Field>

          <Field>
            <label htmlFor="new_password">
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                id="new_password"
                name="new_password"
                placeholder="New Password"
              />
            </label>
            <MessageError>{newPasswordError}</MessageError>
          </Field>

          <Field>
            <label htmlFor="new_password_confirmation">
              <Input
                type="password"
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                id="new_password_confirmation"
                name="new_password_confirmation"
                placeholder="Confirm New Password"
              />
            </label>
            <MessageError>{newPasswordConfirmationError}</MessageError>
          </Field>

          <ButtonsRight>
            <ButtonFilled
              type="submit"
              disabled={
                !newPassword || !currentPassword || !newPasswordConfirmation
              }
            >
              Save
            </ButtonFilled>
          </ButtonsRight>
          <Message>{message}</Message>
        </form>
      </SettingsModal>

      {/* Delete account modal */}
      <SettingsModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: colors.overlay,
          },
        }}
      >
        <ButtonClose onClick={() => setIsDeleteModalOpen(false)}>
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
          <Field>
            <label htmlFor="delete_password">
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                id="delete_password"
                name="delete_password"
                placeholder="Current Password"
              />
            </label>
            <MessageError>{currentPasswordError}</MessageError>
          </Field>

          <ButtonsRight>
            <Button type="button">Cancel</Button>
            <ButtonFilled type="submit">Delete</ButtonFilled>
          </ButtonsRight>
        </form>
      </SettingsModal>
    </Wrapper>
  );
}

export default UserSettings;
