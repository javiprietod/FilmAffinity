import React from 'react';
import RatingStars from './RatingStars';
import { useState, useEffect } from 'react';

function RatingControlDiv({movie}) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div id="rating-register">
      {isLoggedIn ? ( 
          <div className="movie-rating-container" id="movieRating">

          {/* Solo queremos mostrar la barra de votación en caso de que estemos logeados para evitar reviews sin usuario*/}
          {/* Otra opción es que si que permita verlo pero dentro del HandleClick le mande un pop up de "Log in to set rating" */}
          
          <div className='movie-rating-stars'>
            <RatingStars movie={movie}/> 
          </div>
        </div>
      ) : (
          <div>
              <span>Log in to rate your favourite movies</span>
          </div>
      )}
    </div>
    
  );
}
export default RatingControlDiv;
