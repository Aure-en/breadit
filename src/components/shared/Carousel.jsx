import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useCarousel from "../../hooks/useCarousel";

// Icons
import { ReactComponent as IconLeft } from "../../assets/icons/general/icon-left.svg";
import { ReactComponent as IconRight } from "../../assets/icons/general/icon-right.svg";

function Carousel({ images, title }) {
  const {
    slides,
    currentSlide,
    transition,
    transitionDuration,
    previous,
    next,
    handleTransitionEnd,
  } = useCarousel(images);
  useCarousel(images);

  return (
    <Container>
      <SlideNumber>
        {currentSlide + 1}/{slides.length}
      </SlideNumber>
      <ButtonLeft
        type="button"
        onClick={(e) => {
          e.preventDefault();
          previous();
        }}
      >
        <IconLeft />
      </ButtonLeft>
      <Slides
        onTransitionEnd={handleTransitionEnd}
        transition={transition}
        transitionDuration={transitionDuration}
        slides={slides.length}
      >
        {slides.map((image, index) => {
          return (
            <ImageContainer key={`${image}-${index}`}>
              <Image src={image} alt={title} />
            </ImageContainer>
          );
        })}
      </Slides>
      <ButtonRight
        type="button"
        onClick={(e) => {
          e.preventDefault();
          next();
        }}
      >
        <IconRight />
      </ButtonRight>
    </Container>
  );
}

Carousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.images).isRequired,
  title: PropTypes.string,
};

Carousel.defaultProps = {
  title: "",
};

export default Carousel;

const colors = {
  "button-shadow": "rgba(0, 0, 0, .2)",
  background: "rgba(255, 255, 255)",
  "slides-number": "rgba(0, 0, 0, .6)",
};

const Container = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const Slides = styled.div`
  display: flex;
  transition: transform ${(props) => props.transitionDuration}s linear;
  transform: translateX(${(props) => props.transition}%);
  width: ${(props) => props.slides * 100}%;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Image = styled.img`
  max-height: 35rem;
  max-width: 100%;
  object-fit: cover;
  display: inline-block;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Button = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  box-shadow: 0 0 10px ${colors["button-shadow"]};
  background: ${colors.background};
  padding: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
`;

const ButtonLeft = styled(Button)`
  left: 2rem;
`;

const ButtonRight = styled(Button)`
  right: 2rem;
`;

const SlideNumber = styled.span`
  position: absolute;
  top: 2rem;
  right: 2rem;
  font-size: 0.75rem;
  color: ${colors.background};
  background: ${colors["slides-number"]};
  padding: 0.25rem 0.45rem;
  border-radius: 50px;
  z-index: 1;
`;
