import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import useDragAndDrop from "../../hooks/useDragAndDrop";
import useImage from "../../hooks/useImage";

// Icons
import { ReactComponent as IconClose } from "../../assets/icons/general/icon-x.svg";
import { ReactComponent as IconAdd } from "../../assets/icons/content/icon-add.svg";

function Image({ send }) {
  const [isHovered, setIsHovered] = useState();
  const {
    inDragZone,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useDragAndDrop();
  const { images, preview, dropImages, uploadImages, deleteImage } = useImage();

  useEffect(() => {
    send(images);
  }, [images]);

  return (
    <DropArea
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, dropImages)}
      areFilesDragged={inDragZone}
      center={images.length === 0}
    >
      {images.length !== 0 ? (
        <Preview>
          {preview.map((image, index) => {
            return (
              <ImageContainer
                key={image}
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <ImagePreview src={image} alt="preview" />
                {isHovered === index && (
                  <DeleteButton onClick={() => deleteImage(index)}>
                    <IconClose />
                  </DeleteButton>
                )}
              </ImageContainer>
            );
          })}

          <AddImage>
            <HiddenInput type="file" onChange={uploadImages} multiple />
            <IconAdd />
          </AddImage>
        </Preview>
      ) : (
        <div>
          Drag and drop or{" "}
          <Upload>
            <HiddenInput type="file" onChange={uploadImages} multiple />
            Upload
          </Upload>
        </div>
      )}
    </DropArea>
  );
}

export default Image;

Image.propTypes = {
  send: PropTypes.func.isRequired,
};

const DropArea = styled.div`
  max-width: 50rem;
  min-height: 200px;
  border: ${(props) =>
    props.areFilesDragged
      ? `2px dashed ${props.theme.border_active}`
      : `1px dashed ${props.theme.border_secondary}`};
  ${(props) =>
    props.center &&
    `display: flex;
    align-items: center;
    justify-content: center;
  `}
  background: ${(props) => props.theme.input_bg};
`;

const Preview = styled.div`
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0.5rem;
`;

const ImageContainer = styled.div`
  position: relative;
  border: 1px solid ${(props) => props.theme.border_secondary};
  flex-basis: calc(25% - 1.125rem);
  display: flex;
  margin: 0.5rem;

  &:before {
    content: "";
    display: block;
    padding-top: 100%;
  }
`;

const ImagePreview = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const AddImage = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: calc(25% - 1.125rem);
  border: 2px dashed ${(props) => props.theme.text_secondary};
  margin: 0.5rem;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  position: absolute;
  top: -9999px;
`;

const DeleteButton = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0.25rem;
  right: 0.25rem;
  border-radius: 50%;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  color: ${(props) => props.theme.border_secondary};
`;

const Upload = styled.label`
  border-radius: 5rem;
  padding: 0.45rem 1.25rem;
  font-weight: 500;
  display: inline-block;
  color: ${(props) => props.theme.accent_secondary};
  border: 1px solid ${(props) => props.theme.accent_secondary};
  cursor: pointer;
  margin-left: 0.5rem;
`;
