import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login, user, profile, authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (authLoading) return;

  if (user && profile) {
    navigate(profile.role === "admin" ? "/admin" : "/");
  }
}, [user, profile, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login(formData);
      toast.success("Successful authentication");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Error to authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-md items-center px-6 py-16">
      <div className="w-full rounded-[32px] bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-black text-gray-900">Login</h1>
        <p className="mb-8 text-gray-500">Intră în contul tău Glowify</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Parolă"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-500 disabled:opacity-60"
          >
            {loading ? "Se procesează..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500">
          Nu ai cont?{" "}
          <Link to="/register" className="font-semibold text-pink-600">
            Creează cont
          </Link>
        </p>
      </div>
    </section>
  );
}