import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { checkLoggedIn } from './api';
import RatingFixedStars from './FixedRating';


const INITIAL_PAGE = 1;
const MOVIES_PER_PAGE = 9;

function ListPage({ movieList, currentPage, setCurrentPage, numFilms=-1, numPages=-1 }) {
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
  return  <div className="container">
            {
              numFilms !== -1 ?
              <div className="back-button">
                <a href="/" className="back"><strong>← Back</strong></a>
              </div> : null
            }
            <h2 id="main-text">
              {numFilms===-1 ? 
                (loggedIn ? 
                  "Our recommendations for you, " + name 
                  : 'Our movies'
                )
                : 'Movies found: ' + numFilms
              }
            </h2>
            <PageFilter currentPage={currentPage} setCurrentPage={setCurrentPage} numPages={numPages}/>
            <MovieList movieList={movieList} />
          </div>
}

function PageFilter({ currentPage, setCurrentPage, numPages }) {

  function changePage(page) {
    page = Math.max(1, page);
    setCurrentPage(page);
  }

  return <>
    <div className="buttons">
      <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === INITIAL_PAGE}>&lt;</button>
      <input type="number" value={currentPage} onChange={(e) => changePage(e.target.value)} min={INITIAL_PAGE} max={numPages} />
      <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === numPages}>&gt;</button>
    </div>
  </>
}

function MovieList({ movieList }) {
  return (<div className='container-movies'>
    {movieList.map(movie =>
      <NavLink to={`/movie/${movie.id}`} key={movie.id} className="movie-list">
        <Movie movie={movie} />
      </NavLink>
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
  const [numPages, setNumPages] = useState(-1);
  // Get current url parameters
  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    let skip = (currentPage - INITIAL_PAGE) * MOVIES_PER_PAGE;
    const fetchMovies = async () => {
      let url = 'https://filmaff.onrender.com/api/movies?'
      for (const elem of ['title', 'director', 'genre', 'year', 'rating']) {
        if (params.get(elem)) {
          url += `${elem}=${params.get(elem)}&`;
        }
      }
      if (url !== 'https://filmaff.onrender.com/api/movies?') {
        try {
          const response = await fetch(url + `limit=4000000`); // 
          if (!response.ok) {
            throw new Error('Could not obtain list of movies.');
          }
          const data = await response.json();
          setNumFilms(data.length);
        } catch (error) {
          console.error('Error when trying to retrieve the movies:', error);
        }
      }
      try {
        const response = await fetch(url + `limit=${MOVIES_PER_PAGE}&skip=${skip}`, {method: 'GET',credentials: 'include'}); // 
        
        if (!response.ok) {
          throw new Error('Could not obtain list of movies.');
        }
        const data = await response.json();
        setMovieList(data);

        const res = await fetch(url + `limit=4000000`); // 
        if (!res.ok) {
          throw new Error('NCould not obtain list of movies.');
        }
        const data1 = await res.json();
        if (Math.ceil(data1.length / MOVIES_PER_PAGE) !== 0) {
          setNumPages(Math.ceil(data1.length / MOVIES_PER_PAGE));
        } else {
          setNumPages(1);
        }
      } catch (error) {
        console.error('Error when trying to retrieve the movies:', error);
      }
    };

    fetchMovies();
  }, [currentPage]);

  return (
    <ListPage movieList={movieList} currentPage={currentPage} setCurrentPage={setCurrentPage} numFilms={numFilms} numPages={numPages}/>
  )
}
