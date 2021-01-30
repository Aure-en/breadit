import { storage } from "../firebase";

function useStorage() {
  const storageRef = storage.ref();

  const uploadAvatar = (userId, image) => {
    return storageRef
      .child(`users/${userId}/${image.name}${Date.now()}`)
      .put(image)
      .then((snapshot) => snapshot.ref.getDownloadURL());
  };

  const uploadSubreaditIcon = (subreaditId, image) => {
    return storageRef
      .child(`subreadits/${subreaditId}/${image.name}${Date.now()}`)
      .put(image)
      .then((snapshot) => snapshot.ref.getDownloadURL());
  };

  return { uploadAvatar, uploadSubreaditIcon };
}

export default useStorage;
