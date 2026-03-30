import { useReviews } from "../hooks/useReviews";
import { useAuth } from "../context/AuthContext";
import ReviewForm from "./ReviewForm";

function ReviewStars({ rating }) {
  return (
    <div className="text-pink-500 text-lg">
      {"★".repeat(rating)}
      <span className="text-pink-200">{"★".repeat(5 - rating)}</span>
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const { reviewsData, reviewsLoading, refetchReviews } = useReviews(productId);
  const { user } = useAuth();

  const { reviews, averageRating, reviewsCount } = reviewsData;

  if (reviewsLoading) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-lg">
        <h3 className="mb-4 text-3xl font-black text-gray-900">
          Customer Reviews
        </h3>
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-lg">
        <div className="mb-8 flex flex-col gap-4 border-b border-pink-100 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-pink-500">
              Feedback
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              Customer Reviews
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {reviewsCount > 0
                ? `${averageRating}/5 based on ${reviewsCount} review${reviewsCount !== 1 ? "s" : ""}`
                : "No reviews yet"}
            </p>
          </div>

          <div className="rounded-2xl bg-pink-50 px-5 py-4 text-center">
            <div className="text-3xl font-black text-pink-600">
              {reviewsCount > 0 ? averageRating : "-"}
            </div>
            <div className="text-sm text-pink-500">
              {reviewsCount > 0 ? "Average rating" : "Be the first"}
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nu există review-uri încă. Fii primul care scrie unul.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-[24px] border border-pink-100 bg-pink-50/30 p-5"
              >
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {review.userName || "Anonymous User"}
                    </p>
                  </div>

                  <ReviewStars rating={review.rating} />
                </div>

                <p className="text-sm leading-7 text-gray-600">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {user && (
        <ReviewForm productId={productId} onSuccess={refetchReviews} />
      )}
    </div>
  );
}