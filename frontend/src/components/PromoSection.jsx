import { motion } from "motion/react";

const cards = [
  {
    title: "Get Radiant Skin",
    desc: "Skincare premium pentru o rutină fresh și luminoasă.",
    tone: "from-pink-100 to-rose-100",
  },
  {
    title: "Natural Beauty",
    desc: "Produse curate și finisaje naturale pentru zi de zi.",
    tone: "from-rose-100 to-pink-50",
  },
  {
    title: "Trending Makeup",
    desc: "Descoperă cele mai iubite produse ale momentului.",
    tone: "from-pink-200 to-rose-100",
  },
];

export default function PromoSection() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
      {cards.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.45 }}
          className={`group rounded-[30px] bg-gradient-to-br ${item.tone} p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl`}
        >
          <div className="mb-10 h-28 rounded-[24px] bg-white/40 backdrop-blur-sm" />
          <h3 className="mb-2 text-2xl font-black text-gray-900">{item.title}</h3>
          <p className="text-gray-600">{item.desc}</p>
          <div className="mt-5 text-sm font-semibold text-pink-600 opacity-0 transition group-hover:opacity-100">
            Discover more →
          </div>
        </motion.div>
      ))}
    </section>
  );
}