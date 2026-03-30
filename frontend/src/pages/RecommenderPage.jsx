import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

const shadeGroups = [
  {
    id: "light",
    label: "Light",
    suggestedSkinType: "normal",
    shades: [
      {
        code: "LT-01",
        image:
          "https://www.rarebeauty.com/cdn/shop/files/shadefinder-model-100w_360x.jpg?v=1774860184",
      },
      {
        code: "LT-02",
        image:
          "https://www.rarebeauty.com/cdn/shop/files/shadefinder-model-120c_360x.jpg?v=1774860184",
      },
      {
        code: "LT-03",
        image:
          "https://www.rarebeauty.com/cdn/shop/files/shadefinder-model-140c_360x.jpg?v=1774860184",
      },
      {
        code: "LT-04",
        image:
          "https://www.rarebeauty.com/cdn/shop/files/shadefinder-model-150c_360x.jpg?v=1774860184",
      },
    ],
  },
  {
    id: "light-medium",
    label: "Light Medium",
    suggestedSkinType: "uscat",
    shades: [
      {
        code: "LM-01",
        image:
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "LM-02",
        image:
          "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "LM-03",
        image:
          "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "LM-04",
        image:
          "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "medium",
    label: "Medium",
    suggestedSkinType: "mixt",
    shades: [
      {
        code: "MD-01",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "MD-02",
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "MD-03",
        image:
          "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "MD-04",
        image:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "medium-tan",
    label: "Medium Tan",
    suggestedSkinType: "gras",
    shades: [
      {
        code: "MT-01",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "MT-02",
        image:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "MT-03",
        image:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "MT-04",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "medium-deep",
    label: "Medium Deep",
    suggestedSkinType: "mixt",
    shades: [
      {
        code: "MDP-01",
        image:
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "MDP-02",
        image:
          "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "MDP-03",
        image:
          "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "MDP-04",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "deep",
    label: "Deep",
    suggestedSkinType: "normal",
    shades: [
      {
        code: "DP-01",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "DP-02",
        image:
          "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "DP-03",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
      },
      {
        code: "DP-04",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
];

function ShadeSlider({ groups, activeGroupId, onSelectGroup }) {
  const trackRef = useRef(null);

  const activeIndex = Math.max(
    0,
    groups.findIndex((group) => group.id === activeGroupId)
  );

  const handleSelectByClientX = (clientX) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const relativeX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const percent = rect.width === 0 ? 0 : relativeX / rect.width;
    const newIndex = Math.round(percent * (groups.length - 1));

    onSelectGroup(groups[newIndex].id);
  };

  const handleTrackClick = (e) => {
    handleSelectByClientX(e.clientX);
  };

  const leftPercent =
    groups.length > 1 ? (activeIndex / (groups.length - 1)) * 100 : 0;

  return (
    <div className="mb-10">
      <div className="mb-5 grid grid-cols-3 gap-y-3 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-600 md:grid-cols-6">
        {groups.map((group) => {
          const isActive = group.id === activeGroupId;

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => onSelectGroup(group.id)}
              className={`transition ${
                isActive
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative h-3 w-full cursor-pointer rounded-full bg-gradient-to-r from-[#f3d5c1] via-[#d98245] to-[#7d3512]"
      >
        <motion.button
          type="button"
          drag="x"
          dragConstraints={trackRef}
          dragElastic={0}
          dragMomentum={false}
          onDrag={(e, info) => {
            handleSelectByClientX(info.point.x);
          }}
          onDragEnd={(e, info) => {
            handleSelectByClientX(info.point.x);
          }}
          animate={{ left: `${leftPercent}%` }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="absolute top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-4 border-white bg-[#0f172a] shadow-lg active:cursor-grabbing"
          aria-label="Shade range slider"
        />
      </div>
    </div>
  );
}

function ShadeGrid({ group, selectedShadeCode, onSelectShade }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={group.id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        transition={{ duration: 0.28 }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-black uppercase tracking-[0.28em] text-gray-900">
            {group.label}
          </h3>
          <p className="text-sm text-gray-500">{group.shades.length} shades</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {group.shades.map((shade, index) => {
            const isSelected = selectedShadeCode === shade.code;

            return (
              <motion.button
                key={shade.code}
                type="button"
                onClick={() => onSelectShade(group, shade)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.25 }}
                whileHover={{ scale: 1.01 }}
                className={`group relative overflow-hidden rounded-[2px] text-left ${
                  isSelected ? "ring-4 ring-pink-500" : ""
                }`}
              >
                <img
                  src={shade.image}
                  alt={shade.code}
                  className="h-[240px] w-full object-cover transition duration-500 group-hover:scale-105 md:h-[320px] xl:h-[360px]"
                />

                <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/28" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="rounded-full bg-white/90 px-5 py-2 text-lg font-black tracking-[0.2em] text-gray-900 backdrop-blur">
                    {shade.code}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute bottom-4 right-4 rounded-full bg-pink-600 px-4 py-2 text-sm font-bold text-white shadow-lg">
                    Selected
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function RecommenderPage() {
  const [formData, setFormData] = useState({
    productType: "",
    skinType: "",
    finish: "",
    maxPrice: "",
  });

  const [activeGroupId, setActiveGroupId] = useState(shadeGroups[0].id);
  const [selectedShadeCode, setSelectedShadeCode] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedGroup = useMemo(
    () =>
      shadeGroups.find((group) => group.id === activeGroupId) || shadeGroups[0],
    [activeGroupId]
  );

  const handleSelectGroup = (groupId) => {
    setActiveGroupId(groupId);
  };

  const handleSelectShade = (group, shade) => {
    setActiveGroupId(group.id);
    setSelectedShadeCode(shade.code);

    setFormData((prev) => ({
      ...prev,
      skinType: group.suggestedSkinType || prev.skinType,
    }));
  };

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

      const payload = {
        productType: formData.productType,
        skinType: formData.skinType,
        finish: formData.finish,
        maxPrice: formData.maxPrice ? Number(formData.maxPrice) : undefined,
        skinToneCode: selectedShadeCode || null,
      };

      const res = await api.post("/recommender", payload);
      const recommendations = res.data.recommendations || [];

      setResults(recommendations);

      if (recommendations.length === 0) {
        toast("No recommendations found for the selected combination.");
      } else {
        toast.success("Recommendations generated");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      productType: "",
      skinType: "",
      finish: "",
      maxPrice: "",
    });
    setSelectedShadeCode("");
    setActiveGroupId(shadeGroups[0].id);
    setResults([]);
  };

  return (
    <section className="mx-auto max-w-[1500px] px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative mb-10 overflow-hidden rounded-[40px] bg-gradient-to-r from-pink-300 via-pink-200 to-rose-200 px-8 py-12 shadow-xl"
      >
        <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-pink-400/20 blur-3xl" />

        <div className="relative z-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-pink-700">
            Personalized Beauty
          </p>
          <h1 className="mb-3 text-4xl font-black text-gray-900 md:text-6xl">
            Makeup Recommender
          </h1>
          <p className="max-w-2xl text-base leading-7 text-gray-700 md:text-lg">
            Discover the best products for your routine based on finish, budget,
            skin type and selected shade range.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="mb-10 rounded-[36px] bg-white p-8 shadow-lg"
      >
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-pink-500">
              Shade Finder
            </p>
            <h2 className="text-3xl font-black text-gray-900 md:text-5xl">
              Find Your Shade Range
            </h2>
            <p className="mt-3 max-w-2xl text-gray-500">
              Drag the slider or click a label to move between skin tone
              categories. Hover an image to reveal the hardcoded shade code.
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedShadeCode || activeGroupId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-[28px] bg-pink-50 px-6 py-5 text-right"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">
                Selected code
              </p>
              <p className="mt-1 text-3xl font-black text-gray-900">
                {selectedShadeCode || "--"}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <ShadeSlider
          groups={shadeGroups}
          activeGroupId={activeGroupId}
          onSelectGroup={handleSelectGroup}
        />

        <ShadeGrid
          group={selectedGroup}
          selectedShadeCode={selectedShadeCode}
          onSelectShade={handleSelectShade}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.12 }}
        className="mb-10 rounded-[36px] bg-white p-8 shadow-lg"
      >
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-pink-500">
              Filters
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              Personalize your results
            </h2>
          </div>

          {selectedShadeCode && (
            <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600">
              Shade code: {selectedShadeCode}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <select
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            className="rounded-2xl border border-pink-100 bg-pink-50/30 px-4 py-3 outline-none transition focus:border-pink-400"
          >
            <option value="">Choose product type</option>
            <option value="fond de ten">Fond de ten</option>
            <option value="foundation">Foundation</option>
            <option value="concealer">Concealer</option>
            <option value="ruj">Ruj</option>
            <option value="lipstick">Lipstick</option>
            <option value="mascara">Mascara</option>
            <option value="skincare">Skincare</option>
          </select>

          <select
            name="skinType"
            value={formData.skinType}
            onChange={handleChange}
            className="rounded-2xl border border-pink-100 bg-pink-50/30 px-4 py-3 outline-none transition focus:border-pink-400"
          >
            <option value="">Choose skin type</option>
            <option value="normal">Normal</option>
            <option value="uscat">Uscat</option>
            <option value="mixt">Mixt</option>
            <option value="gras">Gras</option>
          </select>

          <select
            name="finish"
            value={formData.finish}
            onChange={handleChange}
            className="rounded-2xl border border-pink-100 bg-pink-50/30 px-4 py-3 outline-none transition focus:border-pink-400"
          >
            <option value="">Choose finish</option>
            <option value="natural">Natural</option>
            <option value="matte">Matte</option>
          </select>

          <input
            type="number"
            name="maxPrice"
            placeholder="Max price"
            value={formData.maxPrice}
            onChange={handleChange}
            className="rounded-2xl border border-pink-100 bg-pink-50/30 px-4 py-3 outline-none transition focus:border-pink-400"
          />

          <div className="flex flex-wrap gap-4 pt-2 md:col-span-2 xl:col-span-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-pink-600 px-8 py-3 font-semibold text-white transition hover:scale-[1.02] hover:bg-pink-500 disabled:opacity-60"
            >
              {loading ? "Searching..." : "Get Recommendations"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-pink-200 bg-white px-8 py-3 font-semibold text-pink-600 transition hover:bg-pink-50"
            >
              Reset
            </button>
          </div>
        </form>
      </motion.div>

      <div>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-pink-500">
              Results
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              Recommended products
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
        </div>

        {results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[32px] bg-white p-10 text-center shadow-lg"
          >
            <p className="text-lg font-semibold text-gray-700">
              No recommendations yet
            </p>
            <p className="mt-2 text-gray-500">
              Select a shade range and complete the filters above.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}