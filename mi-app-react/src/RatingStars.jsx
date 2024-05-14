import React, { useEffect, useState } from 'react';
import './index.css';

const RatingStars = ({reviewScore, setReviewScore}) => {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setRating(reviewScore);
  }, [reviewScore]);
  
  const handleMouseOver = (index) => {
    setRating(index + 1);
  };

  const handleMouseLeave = () => {
    setRating(reviewScore);
  };

  const handleClick = async () => {
    await setReviewScore(rating);
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={index < rating ? "star green" : "star"}
          onMouseOver={() => handleMouseOver(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick()}
        >
          &#9733;
        </span>
      ))} 
    </div>
  );
};
export default RatingStars;