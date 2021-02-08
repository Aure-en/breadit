import { useState, useEffect } from "react";

function useCarousel(images) {
  const [slides, setSlides] = useState([...images]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transition, setTransition] = useState(-100 / slides.length);
  const [transitionDuration, setTransitionDuration] = useState(0.3);
  const [isNext, setIsNext] = useState(false); // Indicates the carousel direction (previous/next)

  const previous = () => {
    setIsNext(false);
    setTransition((prev) => prev + 100 / slides.length);
    setCurrentSlide((prev) => {
      return prev === 0 ? slides.length - 1 : prev - 1;
    });
  };

  const next = () => {
    setIsNext(true);
    setTransition((prev) => prev - 100 / slides.length);
    setCurrentSlide((prev) => {
      return prev === slides.length - 1 ? 0 : prev + 1;
    });
  };

  /* At the end of each transition:
  - The transition duration is set to 0. It allows us to silently reset transform: translateX to 0.
  - The slides order is changed so that there is always a "previous slide" and a "next slide" to go to without jumping too far.
  - Thanks to useEffect, the transition duration is put back to 0.3s to have a smooth animation.
  */
  const handleTransitionEnd = () => {
    setTransitionDuration(0);
    setTransition(-100 / slides.length);

    if (isNext) {
      setSlides((prev) => {
        const slides = [...prev];
        const prevSlide = slides.shift();
        slides.push(prevSlide);
        return slides;
      });
    } else {
      setSlides((prev) => {
        const slides = [...prev];
        const lastSlide = slides.pop();
        slides.unshift(lastSlide);
        return slides;
      });
    }
  };

  useEffect(() => {
    if (transitionDuration === 0) {
      setTransitionDuration(0.3);
    }
  }, [transitionDuration]);

  return {
    slides,
    currentSlide,
    transition,
    transitionDuration,
    previous,
    next,
    handleTransitionEnd,
  };
}

export default useCarousel;
