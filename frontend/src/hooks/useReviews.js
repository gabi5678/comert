import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useReviews(productId) {
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    averageRating: 0,
    reviewsCount: 0,
  });
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const fetchReviews = async () => {
    if (!productId) return;

    try {
      setReviewsLoading(true);
      const res = await api.get(`/reviews/product/${productId}`);
      setReviewsData(res.data);
    } catch (error) {
      console.error("Eroare la reviews:", error);
      setReviewsData({
        reviews: [],
        averageRating: 0,
        reviewsCount: 0,
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return {
    reviewsData,
    reviewsLoading,
    refetchReviews: fetchReviews,
  };
}