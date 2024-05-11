const FixedStars = ({ rating }) => {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={index < rating ? "star green" : "star"}
        >
          &#9733;
        </span>
      ))}
    </div>
  );};
export default FixedStars;

