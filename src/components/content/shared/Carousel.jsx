import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useCarousel from "../../../hooks/useCarousel";

// Icons
import { ReactComponent as IconLeft } from "../../../assets/icons/general/icon-left.svg";
import { ReactComponent as IconRight } from "../../../assets/icons/general/icon-right.svg";

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
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
};

Carousel.defaultProps = {
  title: "",
};

export default Carousel;

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
  box-shadow: 0 0 10px ${(props) => props.theme.shadowSecondary};
  background: ${(props) => props.theme.backgroundSecondary};
  padding: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
`;

const ButtonLeft = styled(Button)`
  left: 1rem;

  @media all and (min-width: 768px) {
    left: 2rem;
  }
`;

const ButtonRight = styled(Button)`
  right: 1rem;

  @media all and (min-width: 768px) {
    right: 2rem;
  }
`;

const SlideNumber = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.75rem;
  color: ${(props) => props.theme.backgroundSecondary};
  background: ${(props) => props.theme.overlayTertiary};
  padding: 0.25rem 0.45rem;
  border-radius: 50px;
  z-index: 1;

  @media all and (min-width: 768px) {
    top: 1rem;
    right: 1rem;
  }
`;
