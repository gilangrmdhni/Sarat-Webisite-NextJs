// components/ImageSlider.js
import React, { useState } from 'react';

const ImageSlider = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextClick = () => {
    const newIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(newIndex);
  };

  const handlePrevClick = () => {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(newIndex);
  };

  return (
    <div className="relative">
      <img
        src={images[currentImageIndex]}
        alt={`Slide ${currentImageIndex + 1}`}
        className="w-full h-auto md:max-h-22"
      />

      <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
        <button onClick={handlePrevClick} className="bg-gray-800 text-white px-2 py-1 mr-2">
          Previous
        </button>
        <button onClick={handleNextClick} className="bg-gray-800 text-white px-2 py-1">
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageSlider;
