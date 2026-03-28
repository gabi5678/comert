const reviews = [
  {
    id: 1,
    name: "Sonia",
    rating: 5,
    text: "Super produs, textura foarte plăcută și finish impecabil.",
  },
  {
    id: 2,
    name: "Bianca",
    rating: 4,
    text: "Mi-a plăcut mult, mai ales pentru machiajul de zi.",
  },
  {
    id: 3,
    name: "Elena",
    rating: 5,
    text: "Arată premium și rezistă foarte bine pe ten.",
  },
];

export default function ProductReviews() {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Customer Reviews</h3>
          <p className="text-sm text-gray-500">4.8/5 based on premium feedback</p>
        </div>
        <div className="text-pink-600 text-xl">★★★★★</div>
      </div>

      <div className="space-y-5">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-2xl border border-pink-100 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold text-gray-900">{review.name}</p>
              <p className="text-pink-600">{"★".repeat(review.rating)}</p>
            </div>
            <p className="text-sm text-gray-600">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}