import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const initialProductForm = {
  name: "",
  slug: "",
  brand: "",
  categoryId: "",
  description: "",
  price: "",
  currency: "RON",
  stock: "",
  images: "",
  featured: false,
  discountPercent: "",
  shades: "",
  finish: "",
  skinType: "",
  isActive: true,
};

export default function AdminPage() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [sortOrder, setSortOrder] = useState(null);

  const [ordersLoading, setOrdersLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  const [productForm, setProductForm] = useState(initialProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productSubmitting, setProductSubmitting] = useState(false);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await api.get("/orders", {
        headers: authHeaders,
      });
      setOrders(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Error loading orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Error loading products");
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Error loading categories");
    }
  };

  const updateStatus = async (orderId, orderStatus) => {
    try {
      await api.put(
        `/orders/${orderId}/status`,
        { orderStatus },
        {
          headers: authHeaders,
        },
      );

      await fetchOrders();
      toast.success("Status updated");
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    }
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProductForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetProductForm = () => {
    setProductForm(initialProductForm);
    setEditingProductId(null);
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name || "",
      slug: product.slug || "",
      brand: product.brand || "",
      categoryId: product.categoryId || "",
      description: product.description || "",
      price: product.price ?? "",
      currency: product.currency || "RON",
      stock: product.stock ?? "",
      images: Array.isArray(product.images) ? product.images.join(", ") : "",
      featured: product.featured === true,
      discountPercent: product.discountPercent ?? "",
      shades: Array.isArray(product.shades) ? product.shades.join(", ") : "",
      finish: product.finish || "",
      skinType: Array.isArray(product.skinType)
        ? product.skinType.join(", ")
        : "",
      isActive: typeof product.isActive === "boolean" ? product.isActive : true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm("Sigur vrei să ștergi acest produs?");
    if (!confirmed) return;

    try {
      await api.delete(`/products/${productId}`, {
        headers: authHeaders,
      });

      toast.success("Product deleted");
      await fetchProducts();

      if (editingProductId === productId) {
        resetProductForm();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error deleting product");
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    try {
      setProductSubmitting(true);

      const payload = {
        name: productForm.name.trim(),
        slug: productForm.slug.trim(),
        brand: productForm.brand.trim(),
        categoryId: productForm.categoryId,
        description: productForm.description.trim(),
        price: Number(productForm.price),
        currency: productForm.currency || "RON",
        stock: Number(productForm.stock || 0),
        images: productForm.images
          ? productForm.images
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        featured: productForm.featured,
        discountPercent: Number(productForm.discountPercent || 0),
        shades: productForm.shades
          ? productForm.shades
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        finish: productForm.finish.trim(),
        skinType: productForm.skinType
          ? productForm.skinType
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        isActive: productForm.isActive,
      };

      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, payload, {
          headers: authHeaders,
        });
        toast.success("Product updated");
      } else {
        await api.post("/products", payload, {
          headers: authHeaders,
        });
        toast.success("Product created");
      }

      resetProductForm();
      await fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error saving product");
    } finally {
      setProductSubmitting(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchProducts();
      fetchCategories();
    }
  }, [token]);

  const getOrderTime = (order) => {
  const createdAt = order?.createdAt;

  if (!createdAt) return 0;

  if (typeof createdAt === "string" || createdAt instanceof Date) {
    const parsed = new Date(createdAt).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  if (typeof createdAt === "object") {
    if (typeof createdAt.seconds === "number") {
      return createdAt.seconds * 1000;
    }

    if (typeof createdAt._seconds === "number") {
      return createdAt._seconds * 1000;
    }

    if (typeof createdAt.toDate === "function") {
      return createdAt.toDate().getTime();
    }
  }

  return 0;
};

const sortedOrders = [...orders].sort((a, b) => {
  if (!sortOrder) return 0;

  const dateA = getOrderTime(a);
  const dateB = getOrderTime(b);

  return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
});

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 rounded-[32px] bg-gradient-to-r from-pink-300 via-pink-200 to-rose-200 p-8 shadow-xl">
        <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-700">Manage orders and products</p>
      </div>

      <div className="grid gap-8">
        <div className="rounded-[32px] bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-gray-900">
              {editingProductId ? "Edit Product" : "Create Product"}
            </h2>

            {editingProductId && (
              <button
                onClick={resetProductForm}
                className="rounded-full border border-pink-200 px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmitProduct}
            className="grid gap-4 md:grid-cols-2"
          >
            <input
              type="text"
              name="name"
              placeholder="Product name"
              value={productForm.name}
              onChange={handleProductChange}
              className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
              required
            />

            <input
              type="text"
              name="slug"
              placeholder="Slug"
              value={productForm.slug}
              onChange={handleProductChange}
              className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
              required
            />

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={productForm.brand}
              onChange={handleProductChange}
              className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
            />

            <select
              name="categoryId"
              value={productForm.categoryId}
              onChange={handleProductChange}
              className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={productForm.price}
              onChange={handleProductChange}
              className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
              required
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={productForm.stock}
              onChange={handleProductChange}
              className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
            />

            <input
              type="text"
              name="finish"
              placeholder="Finish"
              value={productForm.finish}
              onChange={handleProductChange}
              className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
            />

            <input
              type="number"
              name="discountPercent"
              placeholder="Discount percent"
              value={productForm.discountPercent}
              onChange={handleProductChange}
              className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
            />

            <input
              type="text"
              name="images"
              placeholder="Images URLs separate prin virgulă"
              value={productForm.images}
              onChange={handleProductChange}
              className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400 md:col-span-2"
            />

            <input
              type="text"
              name="shades"
              placeholder="Shades separate prin virgulă"
              value={productForm.shades}
              onChange={handleProductChange}
              className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
            />

            <input
              type="text"
              name="skinType"
              placeholder="Skin types separate prin virgulă"
              value={productForm.skinType}
              onChange={handleProductChange}
              className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={productForm.description}
              onChange={handleProductChange}
              className="min-h-[140px] rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400 md:col-span-2"
            />

            <label className="flex items-center gap-3 rounded-2xl border border-pink-100 px-4 py-3">
              <input
                type="checkbox"
                name="featured"
                checked={productForm.featured}
                onChange={handleProductChange}
              />
              <span className="text-sm font-medium text-gray-700">
                Featured
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-pink-100 px-4 py-3">
              <input
                type="checkbox"
                name="isActive"
                checked={productForm.isActive}
                onChange={handleProductChange}
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={productSubmitting}
                className="rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-500 disabled:opacity-60"
              >
                {productSubmitting
                  ? "Saving..."
                  : editingProductId
                    ? "Update Product"
                    : "Create Product"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-black text-gray-900">Products</h2>

          {productsLoading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-[24px] border border-pink-100 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        product.images?.[0] || "https://via.placeholder.com/100"
                      }
                      alt={product.name}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />

                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.brand || "No brand"} • {product.price} RON
                      </p>
                      <p className="text-sm text-gray-500">
                        Stock: {product.stock} •{" "}
                        {product.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-black text-gray-900">Orders</h2>
          <div className="mb-6 flex gap-3">
            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
              className="rounded-full border border-pink-200 px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50"
            >
              Sort by date {sortOrder === "asc" ? "↑" : "↓"}
            </button>

            <button
              onClick={() => setSortOrder(null)}
              className="rounded-full border border-pink-200 px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50"
            >
              Reset
            </button>
          </div>
          {ordersLoading ? (
            <div>Loading orders...</div>
          ) : (
            <div className="space-y-4">
              {sortedOrders.map((order) => (
                <div key={order.id} className="rounded-[28px] bg-pink-50 p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        User: {order.userId}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-pink-600">
                        {order.total} RON
                      </p>
                      <p className="text-sm text-gray-500">
                        Payment: {order.paymentStatus}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-900">
                        Shipping:
                      </span>{" "}
                      {order.shippingAddress?.fullName},{" "}
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.street}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="mb-2 text-sm font-semibold text-gray-900">
                      Items
                    </p>
                    <div className="space-y-2">
                      {order.items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm"
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>
                            {(item.price * item.quantity).toFixed(2)} RON
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {[
                      "pending",
                      "processing",
                      "shipped",
                      "delivered",
                      "cancelled",
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.id, status)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          order.orderStatus === status
                            ? "bg-pink-600 text-white"
                            : "bg-white text-pink-600 hover:bg-pink-100"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
