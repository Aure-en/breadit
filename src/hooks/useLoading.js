import { useRef, useState, useEffect } from "react";

function useLoading(deps) {
  const initial = useRef(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
    } else {
      setLoading(false);
    }
  }, [deps]);

  return loading;
}

export default useLoading;
