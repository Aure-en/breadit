import { useState } from "react";

function useImage() {
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const displayPreview = (files) => {
    const previewFiles = [];
    files.forEach((file) => {
      URL.revokeObjectURL(file);
      previewFiles.push(URL.createObjectURL(file));
    });
    setPreview(previewFiles);
  };

  const dropImages = (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setImages([...images, ...e.dataTransfer.files]);
      displayPreview([...images, ...e.dataTransfer.files]);
    }
  };

  const uploadImages = (e) => {
    if (e.target.files) {
      setImages([...images, ...e.target.files]);
      displayPreview([...images, ...e.target.files]);
    }
  };

  const deleteImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    displayPreview(newImages);
  };

  return {
    images,
    preview,
    dropImages,
    deleteImage,
    uploadImages,
  };
}

export default useImage;
