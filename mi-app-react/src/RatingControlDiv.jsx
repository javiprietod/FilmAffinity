import React from 'react';
import { useLoaderData } from 'react-router-dom';
import RatingStars from './RatingStars';

function RatingControlDiv() {
  let movie = useLoaderData();
  return (
    <div>
      <h2>Rating: {movie.rating} / 5</h2>
      <h3>Number of ratings: </h3> {/* Dejamos la posibilidad de ver cuanta gente ha puesto rating a la pelicula para ver si la nota es más o menos representativa*/}
      {/* Solo queremos mostrar la barra de votación en caso de que estemos logeados para evitar reviews sin usuario*/}
      {/* Otra opción es que si que permita verlo pero dentro del HandleClick le mande un pop up de "Log in to set rating" */}
      <RatingStars /> 
    </div>
  );
}
export default RatingControlDiv;
