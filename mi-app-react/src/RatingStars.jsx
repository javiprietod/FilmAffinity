import React, { useEffect, useState } from 'react';
import './index.css';

const RatingStars = ({movie}) => {
  const [rating, setRating] = useState(0);
  const [confirmedRating, setConfirmedRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [hasReviewed, setHasReviewed] = useState(false);
  {/* setConfirmedRating(llamada_para_ver_si_este_usuario_ha_votado_esta_peli) */}

  const handleMouseOver = (index) => {
    setRating(index + 1);
  };

  const handleMouseLeave = () => {
    setRating(confirmedRating);
  };

  const handleClick = (index) => {
    
    setRating(index + 1);
    setConfirmedRating(index+1);
    /* Añadir la llamada a la patch de posible review anterior y llamada a la creación de una nueva (solo si es desigual?) */
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
