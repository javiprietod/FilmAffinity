import { useEffect, useState } from 'react';
import FixedRating from './FixedRating';
import FixedStars from './FixedStars';

const INITIAL_PAGE = 1;
const REVIEWS_PER_PAGE = 10;

function ListPage({ reviewList, currentPage, setCurrentPage }) {
  return <div className="container">
    <h2>Reviews</h2>
    <PageFilter currentPage={currentPage} setCurrentPage={setCurrentPage} />
    <ReviewList reviewList={reviewList} />
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

function ReviewList({ reviewList }) {
  return (<div className='container-reviews'>
    {reviewList.map(review =>
      <div key={review.id} className="review-list">
        <Review review={review} />
      </div>
    )}
  </div>);
}

function Review({ review }) {
  return (
    <div className="individual-review" id="reviewDetails">
      <div className='user-side-rating'>
        <div>
          <h2>{review.nombre}</h2> {/* Aquí debería ir el nombre del usuario, el cual o cambiamos la base de datos para guardar tb el nombre del usuario o hacemos llamada a la api*/}
        </div>
        <div>
          {/*<FixedRating rating={review.rating}></FixedRating>*/}
          <FixedStars rating={review.rating}></FixedStars>
        </div>
      </div> 
      <div className="review-info" >
        <p>{review.body}</p>
      </div>
    </div>
    )
}

function ReviewSection({movieid}) {
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [reviewList, setReviewList] = useState([]);
  useEffect(() => {
    let skip = (currentPage - INITIAL_PAGE) * REVIEWS_PER_PAGE;
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/reviews/?movieid=${movieid}&limit=${REVIEWS_PER_PAGE}&skip=${skip}`); // 

        if (!response.ok) {
          throw new Error('Unable to retrieve the reviews');
        }
        const data = await response.json();
        setReviewList(data);
        console.log(data)
      } catch (error) {
        console.error('Error found trying to obtain the reviews:', error);
      }
    };

    fetchReviews();
  }, [currentPage]);

  return (
    <ListPage reviewList={reviewList} currentPage={currentPage} setCurrentPage={setCurrentPage} />
  )
}

export default ReviewSection
