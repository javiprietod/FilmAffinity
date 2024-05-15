import React from 'react';
import RatingStars from './RatingStars';
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import FixedRating from './FixedRating';
import RatingTextInput from './RatingTextInput';
import RatingButtons from './RatingButtons';
import { postReview, patchReview, deleteReview, checkLoggedIn, getReviewFromMovieUser} from './api';

function RatingControlDiv({ movie }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [reviewId, setReviewId] = useState(-1);
  const [reviewScore, setReviewScore] = useState(0);
  const [reviewBody, setReviewBody] = useState('');
  const [triggerRender, setTriggerRender] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    checkLoggedIn().then((data) => {
      if (data.isLoggedIn){
        setLoggedIn(true);
        setEmail(data.user.email);
      }
    });
  }, []);

  useEffect(() => {
    getReviewFromMovieUser(movie.id, email).then((data) => {
      if (data !== null && data.length > 0) {
        data = data[0];
        setReviewId(data.id);
        setReviewScore(data.rating);
        setReviewBody(data.body);
      }
    });
  }, [email]);

  const handleSubmit = () => {
    getReviewFromMovieUser(movie.id, data.user.email).then((data) => {
      if (data !== null && data.length > 0) {
        data = data[0];
        setReviewId(data.id);
      }
      setTriggerRender(!triggerRender);
    });
  };
  
  useEffect(() => {
    if (reviewId === -1) {
      postReview(movie.id, email, reviewScore, reviewBody)
    } else {
      patchReview(reviewId, movie.id, reviewScore, reviewBody)
    }
  }, [triggerRender]);
  
  const handleDelete = () => {
    if (reviewId !== -1){
      deleteReview(reviewId)
    }
    setReviewScore(0);
    setReviewBody('');
    setReviewId(-1);
  };

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
            <RatingButtons submitHandler={handleSubmit} deleteHandler={handleDelete} movieId={movie.id}> </RatingButtons>
          </div>
        ) : null}
      </div>
    </div>
  );
}
export default RatingControlDiv;
