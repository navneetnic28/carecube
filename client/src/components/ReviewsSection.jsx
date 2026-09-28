import dummyReviews from "../data/dummyReviews";

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

function ReviewsSection() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold">What patients are saying</h2>
        <p className="mt-2 text-center text-gray-500">
          Real feedback from patients who booked through CareCube
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {dummyReviews.map((review) => (
            <div key={review.id} className="rounded-xl border p-5 shadow-sm">
              <Stars rating={review.rating} />

              <p className="mt-3 text-sm text-gray-600">"{review.comment}"</p>

              <div className="mt-4 border-t pt-3">
                <p className="font-semibold">{review.patientName}</p>
                <p className="text-xs text-gray-500">
                  Visited {review.doctorName} · {review.specialization}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;
