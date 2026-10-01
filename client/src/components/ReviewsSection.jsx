
import { useEffect, useState } from "react";
import dummyReviews from "../data/dummyReviews";

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5 text-yellow-400" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true">
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const totalReviews = dummyReviews.length;

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  // Auto slide
  useEffect(() => {
    if (totalReviews <= 1) return;

    const interval = setInterval(() => {
      nextReview();
    }, 5000);

    return () => clearInterval(interval);
  }, [totalReviews]);

  // Swipe support
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    // Swipe left → next
    if (distance > 50) {
      nextReview();
    }

    // Swipe right → previous
    if (distance < -50) {
      prevReview();
    }

    setTouchStart(null);
  };

  const review = dummyReviews[currentIndex];

  return (
    <section className="bg-white py-10 md:py-12">
      <div className="mx-auto max-w-4xl px-5 sm:px-6">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            What patients are saying
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Real feedback from patients who booked through CareCube
          </p>
        </div>

        {/* Review Carousel */}
        <div
          className="relative mx-auto mt-7 max-w-2xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Previous Button */}
          <button
            type="button"
            onClick={prevReview}
            aria-label="Previous review"
            className="
              absolute left-0 top-1/2 z-10
              -translate-x-1/2 -translate-y-1/2
              flex h-9 w-9 items-center justify-center
              rounded-full border border-gray-200
              bg-white text-gray-700 shadow-md
              transition
              hover:bg-gray-50
              active:scale-95
              sm:h-10 sm:w-10
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4 sm:h-5 sm:w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Review Card */}
          <div
            key={review.id}
            className="
              mx-5 rounded-2xl
              border border-gray-100
              bg-white
              px-6 py-6
              shadow-[0_8px_30px_rgba(0,0,0,0.06)]
              transition-all duration-300
              sm:mx-8 sm:px-10 sm:py-7
            "
          >
            {/* Rating */}
            <div className="flex items-center justify-center">
              <Stars rating={review.rating} />
            </div>

            {/* Quote */}
            <p
              className="
                mt-4 text-center
                text-base leading-7
                text-gray-700
                sm:text-lg
              "
            >
              "{review.comment}"
            </p>

            {/* Patient */}
            <div className="mt-5 border-t border-gray-100 pt-4 text-center">
              <p className="font-semibold text-gray-900">
                {review.patientName}
              </p>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Visited {review.doctorName}
              </p>

              <p className="mt-0.5 text-xs font-medium text-blue-600">
                {review.specialization}
              </p>
            </div>
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextReview}
            aria-label="Next review"
            className="
              absolute right-0 top-1/2 z-10
              translate-x-1/2 -translate-y-1/2
              flex h-9 w-9 items-center justify-center
              rounded-full border border-gray-200
              bg-white text-gray-700 shadow-md
              transition
              hover:bg-gray-50
              active:scale-95
              sm:h-10 sm:w-10
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4 sm:h-5 sm:w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Dots */}
        {totalReviews > 1 && (
          <div className="mt-5 flex justify-center gap-1.5">
            {dummyReviews.map((review, index) => (
              <button
                key={review.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to review ${index + 1}`}
                className={`
                  h-1.5 rounded-full transition-all duration-300
                  ${
                    currentIndex === index
                      ? "w-6 bg-blue-600"
                      : "w-1.5 bg-gray-300 hover:bg-gray-400"
                  }
                `}
              />
            ))}
          </div>
        )}

        {/* Review Counter */}
        {totalReviews > 1 && (
          <p className="mt-2 text-center text-xs text-gray-400">
            {currentIndex + 1} / {totalReviews}
          </p>
        )}
      </div>
    </section>
  );
}

export default ReviewsSection;
