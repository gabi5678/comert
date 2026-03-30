import { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function StarButton({ filled, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="text-4xl leading-none transition hover:scale-110"
    >
      <span className={filled ? "text-pink-500" : "text-pink-200"}>★</span>
    </button>
  );
}

export default function ReviewForm({ productId, onSuccess }) {
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const displayedRating = hoveredRating || formData.rating;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      toast.error("Trebuie să fii logat pentru a adăuga un review");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Scrie un comentariu");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        `/reviews/product/${productId}`,
        {
          rating: formData.rating,
          comment: formData.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Review salvat cu succes");

      setFormData({
        rating: 5,
        comment: "",
      });
      setHoveredRating(0);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Eroare la salvarea review-ului"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[32px] bg-white p-8 shadow-lg">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-pink-500">
        Share your thoughts
      </p>
      <h3 className="mb-6 text-3xl font-black text-gray-900">Leave a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="mb-3 text-sm font-semibold text-gray-900">Your rating</p>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <StarButton
                key={value}
                filled={value <= displayedRating}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    rating: value,
                  }))
                }
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
              />
            ))}
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Selected rating: {formData.rating}/5
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-gray-900">Your review</p>

          <textarea
            rows="5"
            placeholder="Scrie experiența ta cu acest produs..."
            value={formData.comment}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                comment: e.target.value,
              }))
            }
            className="w-full rounded-[24px] border border-pink-100 px-4 py-4 outline-none focus:border-pink-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-pink-600 px-8 py-3 font-semibold text-white transition hover:bg-pink-500 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}