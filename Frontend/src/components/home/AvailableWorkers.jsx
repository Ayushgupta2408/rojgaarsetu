import { Hammer, Wrench, Zap, Truck } from "lucide-react";
import plum from '../../assets/plum.webp';
import ele from '../../assets/elec.webp';
import jcb from '../../assets/jcb.webp';
import carp from '../../assets/carp.webp';
import Card from "./Card";
import { useTranslation } from "react-i18next";

const AvailableWorkers = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-2xl font-bold mb-8">
        {t("availableWorkers.heading")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          name={t("availableWorkers.cards.carpenters.name")}
          desc={t("availableWorkers.cards.carpenters.desc")}
          btntxt={t("availableWorkers.cards.carpenters.button")}
          img={carp}
        />
        <Card
          name={t("availableWorkers.cards.plumbers.name")}
          desc={t("availableWorkers.cards.plumbers.desc")}
          btntxt={t("availableWorkers.cards.plumbers.button")}
          img={plum}
        />
        <Card
          name={t("availableWorkers.cards.electricians.name")}
          desc={t("availableWorkers.cards.electricians.desc")}
          btntxt={t("availableWorkers.cards.electricians.button")}
          img={ele}
        />
        <Card
          name={t("availableWorkers.cards.vehicles.name")}
          desc={t("availableWorkers.cards.vehicles.desc")}
          btntxt={t("availableWorkers.cards.vehicles.button")}
          img={jcb}
        />
      </div>
    </section>
  );
};

export default AvailableWorkers;
