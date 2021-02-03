import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { useAuth } from "../../contexts/AuthContext";
import useUserSettings from "../../hooks/useUserSettings";

const Container = styled.div``;

const AvatarInput = styled.input`
  display: none;
`;

const Avatar = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 100%;
`;

const SettingsModal = styled(Modal)``;

const Button = styled.button``;

const ButtonFilled = styled(Button)``;

const Heading = styled.h1``;

const Subheading = styled.h2``;

const SettingType = styled.h3``;

const Setting = styled.div``;

const Message = styled.div``;

const Field = styled.div``;

const Input = styled.input``;

const Textarea = styled.textarea``;

const Label = styled.label``;

function Settings() {
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
    <>
      <Container>
        <Heading>User Settings</Heading>

        <div>
          <div>
            <AvatarInput
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg, image/jpg, image/bmp"
              onChange={(e) => {
                if (e.target.files.length > 0)
                  handleUpdateAvatar(e.target.files[0]);
              }}
            />
            <label htmlFor="avatar">
              <Avatar src={avatar} alt="Current avatar" />
            </label>
          </div>
          <Subheading>{currentUser.displayName}</Subheading>
        </div>

        <Setting>
          <SettingType>Username</SettingType>
          <Message>{currentUser.displayName}</Message>
        </Setting>

        <Setting>
          <SettingType>Email address</SettingType>
          <Message>{currentUser.email}</Message>
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
          <SettingType>Change Password</SettingType>
          <Message>Password must be at least 6 characters long</Message>
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

        <Setting>
          <div>
            <SettingType>About</SettingType>
            (optional)
          </div>
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
            <ButtonFilled type="submit">Save</ButtonFilled>
          </form>
        </Setting>

        <Setting>
          <SettingType>Account Removal</SettingType>
          <Message>
            If you delete your account, you will not be able to recover it.
          </Message>
          <Button type="button" onClick={() => setIsDeleteModalOpen(true)}>
            Delete
          </Button>
        </Setting>
      </Container>

      {/* Email change modal */}
      <SettingsModal
        isOpen={isEmailModalOpen}
        onRequestClose={() => setIsEmailModalOpen(false)}
      >
        <Subheading>Update your email</Subheading>
        <p>
          Update your email below by entering your new email address and current
          password.
        </p>
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
            <Label htmlFor="email_password">Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              id="email_password"
              name="email_password"
            />
            <Message>{currentPasswordError}</Message>
          </Field>

          <Field>
            <Label htmlFor="email">New Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
            />
            <Message>{emailError}</Message>
          </Field>

          <ButtonFilled type="submit" disabled={!email || !currentPassword}>
            Save
          </ButtonFilled>
          <Message>{message}</Message>
        </form>
      </SettingsModal>

      {/* Password change modal */}
      <SettingsModal
        isOpen={isPasswordModalOpen}
        onRequestClose={() => setIsPasswordModalOpen(false)}
      >
        <Subheading>Update your password</Subheading>
        <p>
          Update your password below by entering your current and new passwords.
        </p>
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
            <Label htmlFor="password_password">Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              id="email_password"
              name="email_password"
            />
            <Message>{currentPasswordError}</Message>
          </Field>

          <Field>
            <Label htmlFor="new_password">New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              id="new_password"
              name="new_password"
            />
            <Message>{newPasswordError}</Message>
          </Field>

          <Field>
            <Label htmlFor="new_password_confirmation">
              Confirm New Password
            </Label>
            <Input
              type="password"
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              id="new_password_confirmation"
              name="new_password_confirmation"
            />
            <Message>{newPasswordConfirmationError}</Message>
          </Field>

          <ButtonFilled
            type="submit"
            disabled={
              !newPassword || !currentPassword || !newPasswordConfirmation
            }
          >
            Save
          </ButtonFilled>
          <Message>{message}</Message>
        </form>
      </SettingsModal>

      {/* Delete account modal */}
      <SettingsModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
      >
        <Subheading>Delete your account</Subheading>
        <p>
          Are you sure you would like to delete your account? <br />
          You will be unable to recover it.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDeleteAccount();
          }}
        >
          <Field>
            <Label htmlFor="delete_password">Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              id="delete_password"
              name="delete_password"
            />
            <Message>{currentPasswordError}</Message>
          </Field>

          <div>
            <Button type="button">Cancel</Button>
            <ButtonFilled type="submit">Delete</ButtonFilled>
          </div>
        </form>
      </SettingsModal>
    </>
  );
}

export default Settings;
