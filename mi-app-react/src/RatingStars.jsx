import React, { useEffect, useState } from 'react';
import './index.css';
import { postReview, patchReview} from './api';

const RatingStars = ({movie, user, reviewScore, reviewId, setPrueba}) => {
  const [rating, setRating] = useState(0);
  const [confirmedRating, setConfirmedRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  {/* setConfirmedRating(llamada_para_ver_si_este_usuario_ha_votado_esta_peli) */}
  useEffect(() => {
    if (reviewScore === 0) {
      setHasReviewed(false);
    } else {
      setHasReviewed(true);
      setConfirmedRating(reviewScore);
      setRating(reviewScore);
    }
  }, [reviewScore]);
  
  const handleMouseOver = (index) => {
    setRating(index + 1);
  };

  const handleMouseLeave = () => {
    setRating(confirmedRating);
  };

  const handleClick = (index) => {
    setRating(index + 1);
    setConfirmedRating(rating);
    setPrueba(rating);
    if (hasReviewed) {
      patchReview(reviewId, rating, movie, null);
    }
    else{
      postReview(movie, user, rating);
    }
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={index < rating ? "star green" : "star"}
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