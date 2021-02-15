import { firestore } from "../firebase";
import useStorage from "./useStorage";

function useSubreaditSettings() {
  const { uploadSubreaditImage } = useStorage();

  const updateIcon = async (image, subreaditId) => {
    const imageUrl = await uploadSubreaditImage(subreaditId, image);
    firestore.collection("subreadits").doc(subreaditId).update({
      icon: imageUrl,
    });
  };

  const updateBanner = async (image, subreaditId) => {
    const imageUrl = await uploadSubreaditImage(subreaditId, image);
    firestore.collection("subreadits").doc(subreaditId).update({
      banner: imageUrl,
    });
  };

  const updateDescription = (description, subreaditId) => {
    return firestore.collection("subreadits").doc(subreaditId).update({
      description,
    });
  };

  const updateRules = (rules, subreaditId) => {
    return firestore.collection("subreadits").doc(subreaditId).update({
      rules,
    });
  };

  return {
    updateIcon,
    updateBanner,
    updateDescription,
    updateRules,
  };
}

export default useSubreaditSettings;
