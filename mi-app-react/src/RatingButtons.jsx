import React, { useState } from 'react';

const RatingButtons = ({ movie, user, reviewId, prueba}) => {
  const [inputValue, setInputValue] = useState('');


  const handleSubmit = () => {
    // Call the API to patch the review with the new body text
    console.log('Input value:', inputValue);
  };

  const handleDelete = () => {
    // Call API to delete the review
    console.log('Review deleted');
  };

  return (
    <div className='personal-rating-buttons'>
        <span> {prueba} </span>
        <button onClick={handleSubmit}>Submit Review</button>
        <button onClick={handleDelete}>Delete Review</button>
    </div>
  );
};

export default RatingButtons;