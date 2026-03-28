import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setProductLoading(true);
        setProductError("");

        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Eroare la produs:", error);
        setProductError(
          error?.response?.data?.message || "Nu am putut încărca produsul."
        );
      } finally {
        setProductLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, productLoading, productError };
}