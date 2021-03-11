import { useRef, useEffect } from "react";

function useInitial(func, deps) {
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      console.log("initial");
    } else {
      console.log("not initial");
      return func();
    }
  }, [deps]);
}

export default useInitial;
