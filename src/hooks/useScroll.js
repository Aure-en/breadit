import { useState, useEffect } from "react";

function useScroll(ref, initial, step) {
  const [limit, setLimit] = useState(initial);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setLimit((prev) => prev + step);
    }
  };

  useEffect(() => {
    if (!ref) return;

    const scroll = () => {
      const refBottom = ref.current.getBoundingClientRect().bottom;
      const windowBottom = document.documentElement.clientHeight;

      // If we haven't reached the end of the posts list, refBottom > windowBottom.
      // If we scroll to the end of the posts list, then refBottom = windowBottom
      // If we scroll past the end of the posts list, then refBottom < windowBottom.
      if (refBottom <= windowBottom) {
        setLimit((prev) => prev + step);
      }
    };

    window.addEventListener("scroll", scroll);
    return () => window.removeEventListener("scroll", scroll);
  }, []);

  return {
    limit,
    handleScroll,
  };
}

export default useScroll;
