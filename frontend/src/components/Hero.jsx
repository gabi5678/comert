export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-pink-300 via-pink-200 to-rose-200 p-12 shadow-2xl">
        
        {/* TEXT */}
        <div className="relative z-10 max-w-xl">
          <h1 className="mb-4 text-5xl font-black leading-tight text-gray-900">
            Discover <br /> Your Beauty
          </h1>

          <p className="mb-8 text-lg text-gray-700">
            Shop the best beauty products online. Glow up with premium makeup.
          </p>

          <button className="rounded-full bg-pink-600 px-8 py-3 font-semibold text-white transition hover:scale-105 hover:bg-pink-500">
            Shop Now
          </button>
        </div>

        {/* decorative blob */}
        <div className="absolute right-[-60px] top-[-60px] h-72 w-72 rounded-full bg-pink-400 opacity-30 blur-3xl"></div>
      </div>
    </section>
  );
}