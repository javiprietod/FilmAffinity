import React from 'react';
import { useLoaderData } from 'react-router-dom';

export default function MovieDescription() {
    let movie = useLoaderData();
    return (
       
        <div className="container">
             <div className="back-button">
                <a href="/" className="back"><strong>← Back</strong></a>
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
                        <strong>Duration:</strong> <span>{movie.duration} minutes</span>
                    </p>
                    <br />
                    <p>
                        <strong>Genre:</strong> <span>{movie.genre}</span>
                    </p>
                    <br />
                </div>
                {/* <div className='voting-control'>


                </div> */}
            </div>
        </div>
    )
}