import { firestore } from "../firebase";

function useSubreaditSettings() {
  const updateIcon = async (image, subreaditId) => {
    firestore.collection("subreadits").doc(subreaditId).update({
      icon: image,
    });
  };

  const updateBanner = async (image, subreaditId) => {
    firestore.collection("subreadits").doc(subreaditId).update({
      banner: image,
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
