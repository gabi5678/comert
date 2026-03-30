import { Link } from "react-router-dom";
import {
  // Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-pink-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-pink-600">
              GLOWIFY
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
              Premium beauty shopping experience cu produse atent selectate,
              recomandări personalizate și livrare rapidă.
            </p>

            <div className="mt-5 flex items-center gap-3">
  
              <a
                href="mailto:contact@glowify.ro"
                className="rounded-full bg-pink-50 p-2 text-pink-600 transition hover:bg-pink-100"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">Quick Links</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500">
              <Link to="/" className="transition hover:text-pink-600">
                Home
              </Link>
              <Link to="/shop" className="transition hover:text-pink-600">
                Shop
              </Link>
              <Link to="/recommender" className="transition hover:text-pink-600">
                Recommender
              </Link>
              <Link to="/login" className="transition hover:text-pink-600">
                Login
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">Contact</h3>
            <div className="mt-4 space-y-4 text-sm text-gray-500">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 text-pink-600" />
                <span>contact@glowify.ro</span>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-pink-600" />
                <span>+40 721 123 456</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-pink-600" />
                <span>Bulevardul Unirii 10, București, România</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">Support</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500">
              <a href="#" className="transition hover:text-pink-600">
                Terms & Conditions
              </a>
              <a href="#" className="transition hover:text-pink-600">
                Privacy Policy
              </a>
              <a href="#" className="transition hover:text-pink-600">
                Delivery & Returns
              </a>
              <a href="#" className="transition hover:text-pink-600">
                FAQ
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-pink-100 pt-6 text-sm text-gray-500">
          © 2026 Glowify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}