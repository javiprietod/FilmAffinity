import React from 'react';

const RatingFixedStars = ({ rating }) => {
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) {
      // Estrella completa
      stars.push(<span key={i}>&#9733;</span>);
    } else if (i === Math.floor(rating) && rating % 1 !== 0) {
      // Estrella parcial
      stars.push(<span key={i}>&#189;</span>);
    }
  }

  return <div>{stars}</div>;
};

export default RatingFixedStars;

