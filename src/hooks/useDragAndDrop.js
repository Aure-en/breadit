import { useState } from "react";

function useDragAndDrop() {
  const [inDragZone, setInDragZone] = useState(false);
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);

  const displayPreview = (draggedFiles) => {
    const previewFiles = [];
    draggedFiles.forEach((file) =>
      previewFiles.push(URL.createObjectURL(file))
    );
    setPreview(previewFiles);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setInDragZone(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInDragZone(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles([...files, ...e.dataTransfer.files]);
      displayPreview([...files, ...e.dataTransfer.files]);
    }
    setInDragZone(false);
  };

  return {
    inDragZone,
    files,
    setFiles,
    preview,
    setPreview,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}

export default useDragAndDrop;
