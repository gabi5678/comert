import { motion } from "motion/react";

const cards = [
  {
    title: "Get Radiant Skin",
    desc: "Skincare premium pentru o rutină fresh și luminoasă.",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80",
    tone: "from-pink-100 to-rose-100",
  },
  {
    title: "Natural Beauty",
    desc: "Produse curate și finisaje naturale pentru zi de zi.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    tone: "from-rose-100 to-pink-50",
  },
  {
    title: "Trending Makeup",
    desc: "Descoperă cele mai iubite produse ale momentului.",
    image:
      "https://images.squarespace-cdn.com/content/v1/57ac7cfac534a59cdf2a9c32/1737474103804-TO3X7U5J2PLET812EMBS/unsplash-image-Bv8pYo9RJno.jpg",
    tone: "from-pink-200 to-rose-100",
  },
];

export default function PromoSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            whileHover={{ y: -6 }}
            className={`overflow-hidden rounded-[30px] bg-gradient-to-br ${item.tone} p-5 shadow-lg`}
          >
            <div className="overflow-hidden rounded-[24px]">
              <img
                src={item.image}
                alt={item.title}
                className="h-56 w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <div className="pt-5">
              <h3 className="mb-2 text-2xl font-black text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}