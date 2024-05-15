import React, {useEffect, useState} from 'react';
import { useLoaderData } from 'react-router-dom';
import RatingControlDiv from './RatingControlDiv';
import ReviewSection from './ReviewSection';
import { NavLink } from 'react-router-dom';

export default function MovieDescription() {
    const [movie, setMovie] = useState(useLoaderData());
    let mov = useLoaderData();
    useEffect(() => {
        setMovie(mov);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
    <div>
        <div className="container">
            <div className="back-button">
                <NavLink to="/" className='back'>
                    <strong>← Back</strong>
                </NavLink>
            </div>
            <div className="movie-details full-info" id="movieDetails">
                <img src={movie.thumbnail} alt="Thumbnail" id="thumbnail" className='thumbnail' />
                <div className="info">
                    <h2>{movie.title}</h2>
                    <p>
                        <strong>Director:</strong> <span>{movie.director}</span>
                    </p>
                    <br />
                    <p>
                        <strong>Year:</strong> <span>{movie.year}</span>
                    </p>
                    <br />
                    <p>
                        <strong>Summary:</strong> <span>{movie.summary}</span>
                    </p>
                    <br />
                    <p>
                        <strong>Running time:</strong> <span>{movie.running_time} minutes</span>
                    </p>
                    <br />
                    <p>
                        <strong>Genre:</strong> <span>{movie.genre}</span>
                    </p>
                    <br />
                </div>
            </div>
            <RatingControlDiv movie={movie}></RatingControlDiv>
        </div>
        <div>
            <div className="review-section" id="reviews">
                <ReviewSection movieid={movie.id}></ReviewSection>
            </div>
        </div>
    </div>
    )
}