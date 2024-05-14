import React, { useState } from 'react';

const RatingButtons = ({submitHandler, deleteHandler}) => {
  const handleSubmit = () => {
    submitHandler();
  };

  const handleDelete = () => {
    deleteHandler();
  };

  return (
    <div className='personal-rating-buttons'>
        <button className='personal-rating-button' onClick={handleSubmit}>Submit Review</button>
        <button className='personal-rating-button' onClick={handleDelete}>Delete Review</button>
    </div>
  );
};

export default RatingButtons;