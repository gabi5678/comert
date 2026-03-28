import { useState } from "react";

export default function ProductInfoTabs({ product }) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { key: "description", label: "Description" },
    { key: "details", label: "Details" },
    { key: "howToUse", label: "How to use" },
  ];

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-lg">
      <div className="mb-6 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === tab.key
                ? "bg-pink-600 text-white"
                : "bg-pink-50 text-pink-600 hover:bg-pink-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "description" && (
        <div className="text-gray-600">
          {product.description || "No description available for this product."}
        </div>
      )}

      {activeTab === "details" && (
        <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
          <div>
            <span className="font-semibold text-gray-900">Brand:</span>{" "}
            {product.brand || "N/A"}
          </div>
          <div>
            <span className="font-semibold text-gray-900">Finish:</span>{" "}
            {product.finish || "N/A"}
          </div>
          <div>
            <span className="font-semibold text-gray-900">Currency:</span>{" "}
            {product.currency || "RON"}
          </div>
          <div>
            <span className="font-semibold text-gray-900">Featured:</span>{" "}
            {product.featured ? "Yes" : "No"}
          </div>
          <div className="sm:col-span-2">
            <span className="font-semibold text-gray-900">Skin type:</span>{" "}
            {Array.isArray(product.skinType) && product.skinType.length > 0
              ? product.skinType.join(", ")
              : "N/A"}
          </div>
          <div className="sm:col-span-2">
            <span className="font-semibold text-gray-900">Shades:</span>{" "}
            {Array.isArray(product.shades) && product.shades.length > 0
              ? product.shades.join(", ")
              : "N/A"}
          </div>
        </div>
      )}

      {activeTab === "howToUse" && (
        <div className="text-gray-600">
          Apply evenly on clean skin and blend using a brush, sponge, or fingertips.
          Build coverage gradually for a natural finish.
        </div>
      )}
    </div>
  );
}