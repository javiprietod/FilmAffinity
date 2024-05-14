import React from 'react';
import RatingStars from './RatingStars';
import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import FixedRating from './FixedRating';
import RatingTextInput from './RatingTextInput';
import RatingButtons from './RatingButtons';
import { postReview, patchReview, deleteReview, checkLoggedIn, getReviewFromMovieUser} from './api';

function RatingControlDiv({movie}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [reviewId, setReviewId] = useState(-1);
  const [reviewScore, setReviewScore] = useState(0);
  const [reviewBody, setReviewBody] = useState('');
  
  const handleSubmit = async () => {
    // Call the API to patch the review with the new body text
    console.log('Review submitted');
    if (reviewId === -1) {
      if (reviewScore !== 0) {
        postReview(movie.id, email, reviewScore, reviewBody);
        setTimeout(async() => {window.location.reload();}, 1000);
      } else {
        console.log('Unable to post review without rating');
      }
    } else {
      patchReview(reviewId, reviewScore, reviewBody);
    }
  };
  
  const handleDelete = () => {
    // Call API to delete the review
    if (reviewId !== -1){
      deleteReview(reviewId);
      setReviewScore(0);
      setReviewBody('');
      setReviewId(-1);
    }
    else {
      console.log('No review to delete');
    } 
  };

  useEffect(() => {
    checkLoggedIn().then((data) => {
      if (data.isLoggedIn){
        setLoggedIn(true);
        setEmail(data.user.email);
        getReviewFromMovieUser(movie.id, data.user.email).then((data) => {
          if (data !== null && data.length > 0) {
            data = data[0];
            setReviewId(data.id);
            setReviewScore(data.rating);
            setReviewBody(data.body);
            console.log('Review found is :', data);
          }
          else {
            console.log('Not reviewed yet');
          }
        });
      }
    });
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
          {loggedIn ? ( 
            <div>
              <div><span>Your rating: </span></div>
              <RatingStars reviewScore={reviewScore}  setReviewScore={setReviewScore}> </RatingStars>
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
        {loggedIn ? (
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
