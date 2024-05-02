import React, { useState } from 'react';
import './index.css'; // Import your CSS file for styling

const RatingStars = () => {
  const [rating, setRating] = useState(0);

  const handleMouseOver = (index) => {
    setRating(index + 1);
  };

  const handleMouseLeave = () => {
    setRating(0);
  };

  const handleClick = (index) => {
    setRating(index + 1);
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={index < rating ? "star yellow" : "star"}
          onMouseOver={() => handleMouseOver(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
