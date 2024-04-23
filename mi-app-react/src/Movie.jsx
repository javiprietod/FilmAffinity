import React from 'react';
import { useLoaderData } from 'react-router-dom';

export default function MovieDescription() {
    let movie = useLoaderData();
    return (
        <div className="container">
            <div className="movie-details" id="movieDetails">
                <img src={movie.thumbnail} alt="Thumbnail" id="thumbnail" />
                <div className="info">
                    <h2>{movie.title}</h2>
                    <p>{movie.description}</p>
                    <p>
                        <strong>Precio:</strong><span>{movie.price}€</span>
                    </p>
                    <p>
                        <strong>Stock:</strong> <span>{movie.stock}</span>
                    </p>
                    <p>
                        <strong>Valoración:</strong> <span>{movie.rating}</span>
                    </p>
                    <p>
                        <strong>Category:</strong> <span>{movie.category}</span>
                    </p>
                </div>
                <div className='voting-control'>


                </div>
            </div>
        </div>

    )
}