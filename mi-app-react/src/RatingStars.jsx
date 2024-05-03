import React, { useEffect, useState } from 'react';
import './index.css';

const RatingStars = ({movie,user,reviewScore,reviewId}) => {
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
    alert(movie.id + " has been rated with " + (index+1) + " stars by " + user);
    setRating(index + 1);
    setConfirmedRating(index+1);
    postReview(movie, user, rating);
    /* Añadir la llamada a la patch de posible review anterior y llamada a la creación de una nueva (solo si es desigual?) */
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

function postReview(movieId, userId, rating) {
  fetch('http://localhost:8000/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Rating: rating,
      Body: 'Review body',
      Movie: movieId,
      User: userId,
    }),
    credentials: 'include',
  })
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error('Failed to post review');
    }
  })
  .then((data) => {
    console.log('Review posted successfully:', data);
  })
  .catch((error) => {
    console.error('Error posting review:', error);
  });
}

