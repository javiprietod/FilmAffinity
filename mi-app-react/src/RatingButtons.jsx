import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const RatingButtons = ({submitHandler, deleteHandler, movieId}) => {

  return (
    <div className='personal-rating-buttons'>
      <NavLink to={`/movie/${movieId}`}>
        <button className='personal-rating-button' onClick={submitHandler}>Submit Review</button>
        <button className='personal-rating-button' onClick={deleteHandler}>Delete Review</button>
      </NavLink>
    </div>
  );
};

export default RatingButtons;