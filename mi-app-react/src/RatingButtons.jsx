import React, { useState } from 'react';

const RatingButtons = ({submitHandler, deleteHandler}) => {

  return (
    <div className='personal-rating-buttons'>
      <button className='personal-rating-button' onClick={submitHandler}>Submit Review</button>
      <button className='personal-rating-button' onClick={deleteHandler}>Delete Review</button>
    </div>
  );
};

export default RatingButtons;