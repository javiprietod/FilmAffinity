import React, { useState } from 'react';

const RatingTextInput = ({reviewScore, reviewBody, setReviewBody}) => {

  const handleChange = (event) => {
    setReviewBody(event.target.value);
  };
  return (
    <div>
      <textarea id='review-text' className='personal-rating-text'
        value={reviewBody}
        onChange={handleChange}
        placeholder={(reviewScore !== 0) ? "Write your review here" : "You must rate the movie first to write a review about it"}
        spellCheck="false"
        disabled={(reviewScore === 0)}
        style={{ resize: 'none' }}
        maxLength={300}
      />
    </div>
  );
};
export default RatingTextInput;
