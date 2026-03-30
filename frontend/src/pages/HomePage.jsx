import Hero from "../components/Hero";
import PromoSection from "../components/PromoSection";
import BenefitsBar from "../components/BenefitsBar";
import ProductGrid from "../components/ProductGrid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BenefitsBar />
      <PromoSection />
      <ProductGrid />
    </>
  );
}