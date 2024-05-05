import { useEffect, useState } from 'react';
import { NavLink as Navlink } from 'react-router-dom';


const INITIAL_PAGE = 1;
const MOVIES_PER_PAGE = 9;

function ListPage({ movieList, currentPage, setCurrentPage }) {
  return <div className="container">
    <h2>Nuestros productos</h2>
    <PageFilter currentPage={currentPage} setCurrentPage={setCurrentPage} />
    <MovieList movieList={movieList} />
    <PageFilter currentPage={currentPage} setCurrentPage={setCurrentPage} />
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
      <img src={movie.thumbnail} alt="Thumbnail" className="thumbnail" />
      <div className="info">
        <h2>{movie.title}</h2>
      </div>
    </div>)
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [movieList, setMovieList] = useState([]);

  useEffect(() => {
    let skip = (currentPage - INITIAL_PAGE) * MOVIES_PER_PAGE;
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/movies?limit=${MOVIES_PER_PAGE}&skip=${skip}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            credentials: 'include',
          }
        ); // 

        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de peliculas');
        }
        const data = await response.json();
        // console.log(data);
        setMovieList(data);
      } catch (error) {
        console.error('Error al obtener los peliculas:', error);
      }
    };

    fetchMovies();
  }, [currentPage]);

  return (
    <ListPage movieList={movieList} currentPage={currentPage} setCurrentPage={setCurrentPage} />
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




