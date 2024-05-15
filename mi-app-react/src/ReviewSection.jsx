import { useEffect, useState } from 'react';
import FixedStars from './FixedStars';
import { getUserFromEmail } from './api.js';

const INITIAL_PAGE = 1;
const REVIEWS_PER_PAGE = 2;

function ListPage({ reviewList, currentPage, setCurrentPage, numPages }) {
  return <div className="individual-review-container">
    { reviewList.length === 0 ? 
      <h2>No reviews found</h2> :
      <>
      <h2>Reviews</h2>
      <PageFilter currentPage={currentPage} setCurrentPage={setCurrentPage} numPages={numPages} />
      <ReviewList reviewList={reviewList} />
      </>
    }
  </div>
}

function PageFilter({ currentPage, setCurrentPage, numPages }) {

  function changePage(page) {
    page = Math.max(1, page);
    setCurrentPage(page);
  }

  return <>
    <div className="buttons">
      <button onClick={() => changePage(currentPage - 1)} disabled={currentPage == INITIAL_PAGE}>&lt;</button>
      <input type="number" value={currentPage} onChange={(e) => changePage(e.target.value)} min={INITIAL_PAGE} max={numPages}/>
      <button onClick={() => changePage(currentPage + 1)} disabled={currentPage == numPages}>&gt;</button>
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
  const [name, setName] = useState('Anonimous')
  
  useEffect(() => {
    getUserFromEmail(review.user)
    .then((data) => {
      data = data[0];
      if (data.nombre !== null) {
        setName(data.nombre);
      } else {
        setName('Anonimous');
      }
    });
  }, [])

  return (
    <div className="individual-review" id="reviewDetails">
      <div className='user-side-rating'>
        <div>
          <h2>{name}</h2>
        </div>
        <div>
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
  const [numPages, setNumPages] = useState(0);
  useEffect(() => {
    let skip = (currentPage - INITIAL_PAGE) * REVIEWS_PER_PAGE;
    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://filmaff.onrender.com/api/reviews/?movieid=${movieid}&limit=${REVIEWS_PER_PAGE}&skip=${skip}`);

        if (!response.ok) {
          throw new Error('Unable to retrieve the reviews');
        }
        const data = await response.json();
        const sortedReviews = data.sort((a, b) => b.rating - a.rating);
        setReviewList(sortedReviews);
        
        // For page filter
        const res = await fetch(`https://filmaff.onrender.com/api/reviews/?movieid=${movieid}`);
        const data2 = await res.json();
        const numReviews = data2.length;
        const numPages = Math.ceil(numReviews / REVIEWS_PER_PAGE);
        if (numPages === 0) {
          setNumPages(1);
        } else {
          setNumPages(numPages);
        }


      } catch (error) {
        console.error('Error found trying to obtain the reviews:', error);
      }
    };

    fetchReviews();
  }, [currentPage]);

  return (
    <ListPage reviewList={reviewList} currentPage={currentPage} setCurrentPage={setCurrentPage} numPages={numPages} />
  )
}

export default ReviewSection
