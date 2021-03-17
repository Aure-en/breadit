import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useAuth } from "../../../contexts/AuthContext";
import useUserSettings from "../../../hooks/useUserSettings";
import useStorage from "../../../hooks/useStorage";
import { toastify } from "../../shared/Toast";

// Assets
import { ReactComponent as IconClose } from "../../../assets/icons/general/icon-x.svg";
import { BREADITOR_AVATAR, BREADITOR_BANNER } from "../../../utils/const";

function Images({ prevAvatar, prevBanner }) {
  const [avatar, setAvatar] = useState(prevAvatar);
  const [banner, setBanner] = useState(prevBanner);
  const [avatarHover, setAvatarHover] = useState(false);
  const [bannerHover, setBannerHover] = useState(false);
  const { uploadImage } = useStorage();
  const { updateAvatar, updateBanner } = useUserSettings();
  const { currentUser } = useAuth();

  const handleUpdateAvatar = async (image) => {
    const imageUrl = await uploadImage(image);
    updateAvatar(currentUser, imageUrl);
    toastify("Avatar successfully updated");
    setAvatar(imageUrl);
  };

  const handleUpdateBanner = async (image) => {
    const imageUrl = await uploadImage(image);
    updateBanner(currentUser.uid, imageUrl);
    toastify("Banner successfully updated");
    setBanner(imageUrl);
  };

  const deleteAvatar = () => {
    updateAvatar(currentUser, BREADITOR_AVATAR);
    setAvatar(BREADITOR_AVATAR);
  };

  const deleteBanner = () => {
    updateBanner(currentUser.uid, BREADITOR_BANNER);
    setBanner(BREADITOR_BANNER);
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
      <label
        htmlFor="avatar"
        onMouseEnter={() => setAvatarHover(true)}
        onMouseLeave={() => setAvatarHover(false)}
      >
        <Avatar src={avatar} alt="Current avatar">
          {avatar !== BREADITOR_AVATAR && avatarHover && (
            <Icon
              onClick={(e) => {
                e.preventDefault();
                deleteAvatar();
              }}
            >
              <IconClose />
            </Icon>
          )}
          {avatar === BREADITOR_AVATAR && (
            <div>
              Upload 
              {' '}
              <br />
              <strong>Avatar</strong>
            </div>
          )}
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
      <label
        htmlFor="banner"
        onMouseEnter={() => setBannerHover(true)}
        onMouseLeave={() => setBannerHover(false)}
      >
        <Banner src={banner} alt="Current banner">
          {banner !== BREADITOR_BANNER && bannerHover && (
            <Icon
              onClick={(e) => {
                e.preventDefault();
                deleteBanner();
              }}
            >
              <IconClose />
            </Icon>
          )}
          {banner === BREADITOR_BANNER && (
            <div>
              Upload <strong>Banner</strong>
              {' '}
              Image
              </div>
          )}
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: ${(props) => props.theme.text_secondary};

  @media all and (min-width: 400px) {
    flex-direction: row;
  }

  & > label {
    margin-bottom: 2rem;

    @media all and (min-width: 400px) {
      margin-right: 2rem;
      margin-bottom: 0;
    }
  }

  & > label:last-child {
    margin-bottom: 0;

    @media all and (min-width: 400px) {
      margin-right: 0;
    }
  }
`;

const ImageInput = styled.input`
  display: none;
`;

const Image = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  background: ${(props) =>
    !(props.src === BREADITOR_BANNER || props.src === BREADITOR_AVATAR)
      ? `url("${props.src}") ${props.theme.header_bg}`
      : props.theme.accent_soft};
  border: ${(props) =>
    (props.src === BREADITOR_BANNER || props.src === BREADITOR_AVATAR) &&
    `1px dashed ${props.theme.text_secondary}`};
  background-position: center;
  background-size: cover;
  text-align: center;
`;

const Icon = styled.span`
  position: absolute;
  right: .25rem;
  top: .25rem;
  color: ${(props) => props.theme.accent}};
`;

const Avatar = styled(Image)`
  width: 5rem;
  height: 5rem;
`;

const Banner = styled(Image)`
  width: 15rem;
  height: 5rem;
`;
