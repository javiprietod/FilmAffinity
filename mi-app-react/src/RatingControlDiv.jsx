import React from 'react';
import RatingStars from './RatingStars';
import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from "react-router-dom";

function RatingControlDiv({movie}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [reviewId, setReviewId] = useState(0);
  const [reviewScore, setReviewScore] = useState(0);
  
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
          fetch(`http://localhost:8000/api/reviews?movieId=${movie.id}&userId=${data.email}`, {
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
  }, [movie]);

  return (
    <div className="rating-container" id="rating-register">
      <div className='global-rating'>
        {movie.rating} stars
      </div>
      <div className='personal-rating'>
        {isLoggedIn ? ( 
            <div className="movie-rating-container" id="movieRating">

            {/* Solo queremos mostrar la barra de votación en caso de que estemos logeados para evitar reviews sin usuario*/}
            {/* Otra opción es que si que permita verlo pero dentro del HandleClick le mande un pop up de "Log in to set rating" */}
            
            <div className='movie-rating-stars'>
              <RatingStars movie={movie.id} user={email} reviewScore={reviewScore}> reviewId = {reviewId} </RatingStars>
            </div>
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
    
  );
}
export default RatingControlDiv;
