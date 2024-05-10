import { useEffect, useState } from 'react';
import { NavLink as Navlink } from 'react-router-dom';
import RatingFixedStars from './FixedRating';


const INITIAL_PAGE = 1;
const MOVIES_PER_PAGE = 9;

function ListPage({ movieList, currentPage, setCurrentPage }) {
  return <div className="container">
    <h2>Nuestras peliculas</h2>
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
      <div className="info" >
        <h2>{movie.title}</h2>
        <RatingFixedStars rating={movie.rating} />
      </div>
    </div>)
}

function App() {
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [movieList, setMovieList] = useState([]);

  useEffect(() => {
    let skip = (currentPage - INITIAL_PAGE) * MOVIES_PER_PAGE;
    const fetchMovies = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/movies?limit=${MOVIES_PER_PAGE}&skip=${skip}`); // 

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

export default App
