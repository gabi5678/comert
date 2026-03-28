export default function PromoSection() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
      
      {[
        {
          title: "Get Radiant Skin",
          desc: "Skincare premium pentru tine",
        },
        {
          title: "Natural Beauty",
          desc: "Produse curate și eficiente",
        },
        {
          title: "Trending Makeup",
          desc: "Top produse în trend",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="group rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
        >
          <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
          <p className="text-gray-500">{item.desc}</p>

          <div className="mt-4 text-pink-600 opacity-0 transition group-hover:opacity-100">
            Shop →
          </div>
        </div>
      ))}
    </section>
  );
}