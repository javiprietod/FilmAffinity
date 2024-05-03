import React from 'react';
import { useLoaderData } from 'react-router-dom';
import RatingStars from './RatingStars';

function RatingControlDiv() {
  let movie = useLoaderData();
  return (
    <div className="movie-rating-container" id="movieRating">
      
      {/* Solo queremos mostrar la barra de votación en caso de que estemos logeados para evitar reviews sin usuario*/}
      {/* Otra opción es que si que permita verlo pero dentro del HandleClick le mande un pop up de "Log in to set rating" */}
      
      <div className='movie-rating-stars'>
        <RatingStars /> 
      </div>
    </div>
  );
}
export default RatingControlDiv;
