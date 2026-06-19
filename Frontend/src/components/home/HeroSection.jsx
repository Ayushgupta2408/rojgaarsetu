import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import heroimg from "../../assets/heroimg1.jpg";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-[#E9F1FA] py-34 px-4 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-60 items-center">
      <div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          {t("hero.titleLine1")} <br /> {t("hero.titleLine2")}
        </h1>
        <p className="text-gray-600 mb-6">
          {t("hero.description")}
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
            {t("hero.btnFindWorkers")}
          </button>
          <button className="border border-blue-600 text-blue-600 px-5 py-2 rounded hover:bg-blue-600 hover:text-white">
            {t("hero.btnPostJob")}
          </button>
        </div>
      </div>
      <motion.img
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        height={400}
        width={450}
        src={heroimg}
        alt={t("hero.imageAlt")}
        className="rounded shadow-md"
      />
    </section>
  );
};

export default HeroSection;
