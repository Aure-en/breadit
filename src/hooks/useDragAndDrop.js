import { useState } from "react";

function useDragAndDrop() {
  const [inDragZone, setInDragZone] = useState(false);

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

  const handleDrop = (e, callback) => {
    e.preventDefault();
    e.stopPropagation();
    callback(e);
    setInDragZone(false);
  };

  return {
    inDragZone,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}

export default useDragAndDrop;
