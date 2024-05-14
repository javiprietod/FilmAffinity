import React from 'react';
import RatingStars from './RatingStars';
import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import FixedRating from './FixedRating';
import RatingTextInput from './RatingTextInput';
import RatingButtons from './RatingButtons';
import { postReview, patchReview} from './api';

function RatingControlDiv({movie}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [reviewId, setReviewId] = useState(0);
  const [reviewScore, setReviewScore] = useState(0);
  const [reviewBody, setReviewBody] = useState('');
  
  const handleSubmit = () => {
    // Call the API to patch the review with the new body text
    console.log('Input value:', reviewScore);
  };

  const handleDelete = () => {
    // Call API to delete the review
    console.log('Review deleted');
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch user data
      fetch('http://localhost:8000/api/users/me/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed to fetch user data');
          }
        })
        .then((data) => {
          setEmail(data.email);
          setIsLoggedIn(true);

          // Fetch review for the movie and user if it exists
          fetch(`http://localhost:8000/api/reviews/`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            credentials: 'include',
          })
            .then((res) => {
              if (res.ok) {
                return res.json();
              } else {
                throw new Error('Failed to fetch review data');
              }
            })
            .then((reviewData) => {
              const selectedReview = reviewData.find(review => review.movie === movie.id && review.user === data.email);
              if (selectedReview) {
                setReviewId(selectedReview.id);
                setReviewScore(selectedReview.rating);
              } else {
                console.log('Review not found');
              }
            })
            .catch((error) => {
              console.log(error.message, 'error');
            });
        })
        .catch((error) => {
          console.log(error.message, 'error');
        });
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="movie-rating-container" id="rating-register">
        <div className='global-rating'>
          <div>
            <span> Filmaffinity rating:</span>
          </div>
          <FixedRating rating={movie.rating}></FixedRating>
        </div>
        <div className='personal-rating-stars'>
          {isLoggedIn ? ( 
            <div>
              <div><span>Your rating: </span></div>
              <RatingStars reviewScore={reviewScore}  setReviewScore={setReviewScore} submitHandler={handleSubmit}> </RatingStars>
            </div>
          ) : (
              <div>
                <NavLink to="/login">
                  <strong className="movie-rating-loginlink">Login</strong> 
                </NavLink>
                <span> to rate your favorite movies! </span>
              </div>
          )}
        </div>
      </div>
      <div>
        {isLoggedIn ? (
          <div>
            <RatingTextInput reviewScore={reviewScore} reviewBody={reviewBody} setReviewBody={setReviewBody}>  </RatingTextInput>
            <RatingButtons submitHandler={handleSubmit} deleteHandler={handleDelete}> </RatingButtons>
          </div>
        ) : null}
      </div>
    </div>
  );
}
export default RatingControlDiv;
