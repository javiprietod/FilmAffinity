import React, { useState } from 'react';

const RatingTextInput = ({ movie, user, reviewId, prueba}) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  return (
    <div>
      <textarea  className='personal-rating-text'
        value={inputValue}
        onChange={handleChange}
        placeholder={(prueba !== 0) ? "Write your review here" : "You must rate the movie first to write a review about it"}
        spellCheck="false"
        disabled={(prueba === 0)}
        style={{ resize: 'none' }}
        maxLength={300}
      />
    </div>
  );
};

export default RatingTextInput;
