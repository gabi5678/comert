const benefits = [
  {
    title: "Free Shipping",
    desc: "For orders over 199 RON",
  },
  {
    title: "Secure Payment",
    desc: "Secure online payment with Stripe",
  },
  {
    title: "Personalized Picks",
    desc: "Recommendations by style and skin type",
  },
];

export default function BenefitsBar() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <div className="grid gap-4 rounded-[32px] bg-white p-6 shadow-lg md:grid-cols-3">
        {benefits.map((item) => (
          <div
            key={item.title}
            className="rounded-[24px] bg-pink-50 px-5 py-5 text-center"
          >
            <h3 className="mb-2 text-lg font-black text-gray-900">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
