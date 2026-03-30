import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="relative overflow-hidden rounded-[42px] bg-gradient-to-r from-pink-300 via-pink-200 to-rose-200 p-8 shadow-2xl md:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_30%)]" />
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-pink-400/30 blur-3xl" />
        <div className="absolute -bottom-20 left-20 h-60 w-60 rounded-full bg-rose-300/30 blur-3xl" />

        <div className="relative z-10 grid items-center gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-pink-700">
              Premium Beauty Store
            </p>

            <h1 className="mb-5 text-5xl font-black leading-tight text-gray-900 md:text-6xl">
              Discover <br /> Your Beauty
            </h1>

            <p className="mb-8 max-w-xl text-base leading-7 text-gray-700 md:text-lg">
              Explore premium makeup, skincare and personalized recommendations
              built around your style, skin type and beauty routine.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="rounded-full bg-pink-600 px-8 py-3 font-semibold text-white transition hover:scale-105 hover:bg-pink-500"
              >
                Shop Now
              </Link>

              <Link
                to="/recommender"
                className="rounded-full bg-white/80 px-8 py-3 font-semibold text-pink-700 backdrop-blur transition hover:scale-105"
              >
                Find My Match
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-[32px] bg-white/55 p-5 shadow-2xl backdrop-blur-md">
              <div className="group relative h-[480px] overflow-hidden rounded-[26px]">
                <img
                  src="https://www.conceptsnc.com/wp-content/uploads/2023/12/naj-oleari-studio-concept-still-life.webp"
                  alt="Glowify beauty collection"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-pink-500/20 to-pink-100/20 transition duration-500 group-hover:from-black/10 group-hover:via-transparent group-hover:to-transparent" />

                <div className="absolute left-0 top-0 w-full px-6 pt-6 text-center transition duration-500 group-hover:opacity-0 group-hover:-translate-y-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-white/90">
                    Glowify Collection
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 transition duration-500 group-hover:opacity-0 group-hover:translate-y-6">
                  <p className="max-w-sm text-4xl font-black leading-tight text-white drop-shadow-lg">
                    Beauty, but make it iconic
                  </p>
                  <p className="mt-3 max-w-md text-sm text-white/85">
                    Premium textures, radiant finishes and beauty essentials
                    curated for your perfect look.
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-6 top-8 rounded-2xl bg-white px-4 py-3 shadow-xl"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                Trending
              </p>
              <p className="text-sm font-bold text-gray-900">Best Sellers</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-6 right-4 rounded-2xl bg-white px-4 py-3 shadow-xl"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                Personalized
              </p>
              <p className="text-sm font-bold text-gray-900">Recommender</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}