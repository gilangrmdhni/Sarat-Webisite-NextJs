// components/Carousel.js

import { useState } from 'react';

const images = [
    '/images/slider1.png',
    '/images/slider2.png',
    '/images/slider3.png',
];
const Carousel = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-screen-sm mx-auto">
      <img
        src={images[currentImage]}
        alt="carousel"
        className="w-full rounded-lg"
      />
      <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2 px-2 py-1 bg-black bg-opacity-50 text-white rounded-l-md"
        onClick={prevImage}
      >
        Prev
      </button>
      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2 px-2 py-1 bg-black bg-opacity-50 text-white rounded-r-md"
        onClick={nextImage}
      >
        Next
      </button>
    </div>
  );
};

export default Carousel;
