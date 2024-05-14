import { useEffect, useState } from 'react';
import { NavLink as Navlink } from 'react-router-dom';
import { checkLoggedIn } from './api';
import RatingFixedStars from './FixedRating';


const INITIAL_PAGE = 1;
const MOVIES_PER_PAGE = 9;

function ListPage({ movieList, currentPage, setCurrentPage, numFilms=-1 }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState('');
  useEffect(() => {
    checkLoggedIn().then((data) => {
      if (data.isLoggedIn){
        setLoggedIn(true);
        setName(data.user.nombre);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);
  return <div className="container">
    <h2>
      {numFilms===-1 ? 
      
        (loggedIn ? 
          "Our recommendations for you, " + name 
          : 'Our movies'
        )
        : 'Películas encontradas: ' + numFilms
        
      }
      {console.log(numFilms)}
    </h2>
    <PageFilter currentPage={currentPage} setCurrentPage={setCurrentPage} />
    <MovieList movieList={movieList} />
  </div>
}

function PageFilter({ currentPage, setCurrentPage }) {

  function changePage(page) {
    page = Math.max(1, page);
    setCurrentPage(page);
  }

  return <>
    <div className="buttons">
      <button onClick={() => changePage(currentPage - 1)} disabled={currentPage == INITIAL_PAGE}>&lt;</button>
      <input type="number" value={currentPage} onChange={(e) => changePage(e.target.value)} />
      <button onClick={() => changePage(currentPage + 1)}>&gt;</button>
    </div>
  </>
}

function MovieList({ movieList }) {
  return (<div className='container-movies'>
    {movieList.map(movie =>
      <Navlink to={`/movie/${movie.id}`} key={movie.id} className="movie-list">
        <Movie movie={movie} />
      </Navlink>
    )}
  </div>);
}

function Movie({ movie }) {
  return (
    <div className="movie-details" id="movieDetails">
      <div className='rating-overlay'>
        <RatingFixedStars rating={movie.rating} />
      </div>
      <img src={movie.thumbnail} alt="Thumbnail" className="thumbnail" />
      <div className="info" >
        <h2>{movie.title}</h2>
      </div>
    </div>)
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [movieList, setMovieList] = useState([]);
  const [numFilms, setNumFilms] = useState(-1);
  // Get current url parameters
  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    let skip = (currentPage - INITIAL_PAGE) * MOVIES_PER_PAGE;
    const fetchMovies = async () => {
      let url = 'http://localhost:8000/api/movies?'
      for (const elem of ['title', 'director', 'genre', 'year', 'rating']) {
        if (params.get(elem)) {
          url += `${elem}=${params.get(elem)}&`;
        }
      }
      try {
        const response = await fetch(url + `limit=4000000`); // 

        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de peliculas');
        }
        const data = await response.json();
        // console.log(data);
        setNumFilms(data.length);
      } catch (error) {
        console.error('Error al obtener los peliculas:', error);
      }
      try {
        const response = await fetch(url + `limit=${MOVIES_PER_PAGE}&skip=${skip}`); // 

        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de peliculas');
        }
        const data = await response.json();
        setMovieList(data);
      } catch (error) {
        console.error('Error al obtener los peliculas:', error);
      }
    };

    fetchMovies();
  }, [currentPage]);

  return (
    <ListPage movieList={movieList} currentPage={currentPage} setCurrentPage={setCurrentPage} numFilms={numFilms} />
  )
}

function sortMovies(movies, preferences) {
  // Weighting system - adjust numbers as needed
  const genreWeight = {
    liked: 1,
    neutral: 0,
    disliked: -1
  };

  return movies.sort((a, b) => {
    // Determine genre preference weight
    const weightA = preferences.likedGenres.includes(a.genre) ? genreWeight.liked :
                    preferences.dislikedGenres.includes(a.genre) ? genreWeight.disliked :
                    genreWeight.neutral;
    const weightB = preferences.likedGenres.includes(b.genre) ? genreWeight.liked :
                    preferences.dislikedGenres.includes(b.genre) ? genreWeight.disliked :
                    genreWeight.neutral;

    // First, compare based on genre preference
    if (weightA !== weightB) {
      return weightB - weightA; // Note: Higher weight should come first
    }

    // If genres have the same preference weight, sort by rating
    return b.rating - a.rating;
  });
}




