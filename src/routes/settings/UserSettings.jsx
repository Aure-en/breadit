import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import useUser from "../../hooks/useUser";
import Email from "../../components/user/settings/Email";
import Password from "../../components/user/settings/Password";
import About from "../../components/user/settings/About";
import Images from "../../components/user/settings/Images";
import DeleteAccount from "../../components/user/settings/DeleteAccount";

function UserSettings() {
  const { currentUser } = useAuth();
  const [user, setUser] = useState();
  const { getUser } = useUser();

  // Loads the user's current avatar, banner and about.
  useEffect(() => {
    (async () => {
      const user = await getUser(currentUser.uid);
      setUser(user.data());
    })();
  });

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
          <Email />
        </Setting>

        <Setting>
          <div>
            <SettingType>Change Password</SettingType>
            <Message>Password must be at least 6 characters long</Message>
          </div>
          <Password />
        </Setting>

        <Category>Profile Information</Category>

        <AboutField>
          <div>
            <SettingType>About (optional)</SettingType>
            <Message>
              A brief description of yourself shown on your profile.
            </Message>
            {user && <About prevAbout={user.about} />}
          </div>
        </AboutField>

        <Setting>
          <div>
            <SettingType>Avatar and banner image</SettingType>
            <Message>Images must be .png or .jpg format</Message>
            {user && (
              <Images prevAvatar={user.avatar} prevBanner={user.banner} />
            )}
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
          <DeleteAccount />
        </Setting>
      </Container>
    </Wrapper>
  );
}

export default UserSettings;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  padding: 1rem;
  background: ${(props) => props.theme.backgroundSecondary};

  @media all and (min-width: 576px) {
    padding: 3rem;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 50rem;
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
  color: ${(props) => props.theme.secondary};
  border-bottom: 1px solid ${(props) => props.theme.secondary};
`;

const Setting = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
`;

const AboutField = styled.div`
  margin: 2rem 0;
`;

const SettingType = styled.h3`
  font-weight: 500;
  font-size: 1rem;
  line-height: 2rem;
`;

const Message = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.secondary};
  margin-bottom: 0.5rem;
  margin-right: 1rem;
`;
