import React from 'react';

const FixedRating = ({ rating }) => {
  return (
    <div>
        <span className ='star-fixed'>&#9733;</span>
        <span><strong className ='star-fixed'>{rating}</strong> /5</span>
    </div>
  );};
export default FixedRating;

