import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const RatingButtons = ({submitHandler, deleteHandler}) => {
  const handleSubmit = () => {
    submitHandler();
  };

  const handleDelete = () => {
    deleteHandler();
  };

  return (
    <div className='personal-rating-buttons'>
        <NavLink>
          <button className='personal-rating-button' onClick={handleSubmit}>Submit Review</button>
        </NavLink>
        <NavLink>
          <button className='personal-rating-button' onClick={handleDelete}>Delete Review</button>
        </NavLink>
    </div>
  );
};

export default RatingButtons;