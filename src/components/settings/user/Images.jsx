import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useAuth } from "../../../contexts/AuthContext";
import useUserSettings from "../../../hooks/useUserSettings";
import useStorage from "../../../hooks/useStorage";

function Images({ prevAvatar, prevBanner }) {
  const [avatar, setAvatar] = useState(prevAvatar);
  const [banner, setBanner] = useState(prevBanner);
  const { uploadImage } = useStorage();
  const { updateAvatar, updateBanner } = useUserSettings();
  const { currentUser } = useAuth();

  const handleUpdateAvatar = async (image) => {
    const imageUrl = await uploadImage(image);
    updateAvatar(currentUser.uid, imageUrl);
    setAvatar(imageUrl);
  };

  const handleUpdateBanner = async (image) => {
    const imageUrl = await uploadImage(image);
    updateBanner(currentUser.uid, imageUrl);
    setBanner(imageUrl);
  };

  const deleteAvatar = () => {
    updateAvatar(currentUser.uid, "");
    setAvatar("");
  };

  const deleteBanner = () => {
    updateBanner(currentUser.uid, "");
    setBanner("");
  };

  return (
    <Container>
      <ImageInput
        type="file"
        id="avatar"
        name="avatar"
        accept="image/png, image/jpeg, image/jpg"
        onChange={(e) => {
          if (e.target.files.length > 0) handleUpdateAvatar(e.target.files[0]);
        }}
      />
      <label htmlFor="avatar">
        <Avatar src={avatar} alt="Current avatar">
          {!avatar && <Message>Upload <strong>Avatar</strong></Message>}
        </Avatar>
      </label>

      <ImageInput
        type="file"
        id="banner"
        name="banner"
        accept="image/png, image/jpeg, image/jpg"
        onChange={(e) => {
          if (e.target.files.length > 0) handleUpdateBanner(e.target.files[0]);
        }}
      />
      <label htmlFor="banner">
        <Banner src={banner} alt="Current banner">
          {!banner && <Message>Drag and Drop or Upload <strong>Banner</strong> Image</Message>}
        </Banner>
      </label>
    </Container>
  );
}

Images.propTypes = {
  prevAvatar: PropTypes.string,
  prevBanner: PropTypes.string,
};

Images.defaultProps = {
  prevAvatar: "",
  prevBanner: "",
};

export default Images;
const colors = {
  background: "grey",
  border: "red",
  accent: "red",
};

const Container = styled.div`
  display: flex;
  margin-top: 1rem;

  & > label {
    margin-right: 2rem;
  }

  & > label:last-child {
    margin-right: 0;
  }
`;

const ImageInput = styled.input`
  display: none;
`;

const Image = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  background: ${(props) =>
    props.src ? `url("${props.src}")` : colors.background};
  border: ${(props) => !props.src && `1px dashed ${colors.border}`};
  background-position: center;
  background-size: cover;
`;

const Avatar = styled(Image)`
  width: 5rem;
  height: 5rem;
`;

const Banner = styled(Image)`
  width: 15rem;
  height: 5rem;
`;

const Message = styled.div`
`;