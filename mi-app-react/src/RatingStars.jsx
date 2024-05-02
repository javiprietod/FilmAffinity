import React, { useEffect, useState } from 'react';
import './index.css';

const RatingStars = () => {
  const [rating, setRating] = useState(0);

  const handleMouseOver = (index) => {
    setRating(index + 1);
  };

  const handleMouseLeave = () => {
    setRating(0);
    /* Si quita el ratón queremos el valor que tenga ya asignado si ya tenía review*/
  };

  const handleClick = (index) => {
    alert(`You selected star number ${index + 1}`);
    setRating(index + 1);
    /* Añadir la llamada a la eliminacion de posible review anterior y llamada a la creación de una nueva (solo si es desigual?) */
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
      <span> / 5</span>
    </div>
  );
};

export default RatingStars;
